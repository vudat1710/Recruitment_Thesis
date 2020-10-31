from underthesea import word_tokenize, sent_tokenize
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.svm import SVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score
import pickle as pkl
import os, time
from utils import load_stop_list, read_data_file
from constants import STOPWORDS_PATH, DATA_PATH, MODEL_PATH

class Preprocess(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.STOPWORDS = load_stop_list(STOPWORDS_PATH)
    
    def fit(self, *_):
        return self

    def remove_stopwords(self, text):
        tokens = word_tokenize(text, format("text")).split(" ")
        return ' '.join([x for x in tokens if x not in self.STOPWORDS])

    def transform(self, X, y=None, **fit_params):
        return [self.remove_stopwords(x) for x in X] 

class Model:
    def __init__(self, model_name):
        self.classifier = self.get_model(model_name)
    
    def get_model(self, model_name):
        if model_name == "nb":
            return Pipeline([
                ('preprocess', Preprocess()),
                ('tfidf_vectorize', TfidfVectorizer()),
                ('classify', MultinomialNB())
            ])
        elif model_name == "svm":
            return Pipeline([
                ('preprocess', Preprocess()),
                ('tfidf_vectorize', TfidfVectorizer()),
                ('classify', SVC())
            ])
        elif model_name == "dt":
            return Pipeline([
                ('preprocess', Preprocess()),
                ('tfidf_vectorize', TfidfVectorizer()),
                ('classify', DecisionTreeClassifier())
            ])
        elif model_name == "log":
            return Pipeline([
                ('preprocess', Preprocess()),
                ('tfidf_vectorize', TfidfVectorizer()),
                ('classify', LogisticRegression())
            ])
        else:
            raise Exception("Model not supported")

if __name__=="__main__":
    nb = Model("nb")
    
    for filename in os.listdir(DATA_PATH):
        nb = Model("nb")
        filepath = DATA_PATH + filename
        print("Filename: ", filename)
        X, y = read_data_file(filepath)
        print(len([a for a in y if a == 1]))
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, stratify=y) 

        nb.classifier.fit(X_train, y_train)
        y_pred = nb.classifier.predict(X_test)
        
        print("Acc: ", accuracy_score(y_test, y_pred))
        print(y_pred)
        print(y_test)
        pkl.dump(nb, open(MODEL_PATH + "nb/{}.pkl".format(filename), "wb"))
        print("F1: ", f1_score(y_test, y_pred, average="binary", pos_label=1))

        
        print(time.asctime())