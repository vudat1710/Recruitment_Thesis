from underthesea.word_tokenize import word_tokenize
import re
from .utils import get_prefix_threshold, build_inverted_index, preprocess, sort_by_frequency
from py_stringmatching.similarity_measure.soft_tfidf import SoftTfIdf

class DuplicateFiltering:
    def __init__(self, num_fields_checked, Y, threshold_tfidf=0.75, sim_threshold=0.8):
        self.threshold_tfidf = threshold_tfidf
        self.sim_threshold = sim_threshold
        self.num_fields_checked = num_fields_checked
        self.Y_norm = []
        for y in Y:
            temp = []
            for i in range(num_fields_checked):
                temp.append([word.lower() for word in re.compile("[\\w_]+").findall(word_tokenize(y[i], format="text"))])
            self.Y_norm.append(temp)
        fields = [[] for _ in range(num_fields_checked)]
        for y in self.Y_norm:
            for i in range(num_fields_checked):
                fields[i].append(y[i])
        
        self.inverted_indices = [build_inverted_index(fields[i]) for i in range(num_fields_checked)]
        self.scoring_models = [SoftTfIdf(fields[i]) for i in range(num_fields_checked)]
        # [print(self.inverted_indices[i]["ngân_hàng"]) for i in range(num_fields_checked)]

    def is_match(self, X):
        X_norm = [[word.lower() for word in re.compile("[\\w_]+").findall(word_tokenize(X[i], format="text"))] for i in range(self.num_fields_checked)]
        size_filtered_candidates = self.size_filtering(X_norm, self.Y_norm)
        candidates = self.position_filtering(X_norm, size_filtered_candidates)
        # print(candidates)
        for y in candidates:
            can_break = True
            for i in range(self.num_fields_checked):
                if self.scoring_models[i].get_raw_score(X_norm[i], y[i]) < self.threshold_tfidf:
                    can_break = False
                    break
            if can_break:
                return True
        
        return False

    
    def size_filtering(self, X, Y):
        candidates = []

        for y in Y:
            matched = True
            for i in range(self.num_fields_checked):
                value_to_compare = len(y[i]) / len(X[i])
                if not (1 / self.sim_threshold >= value_to_compare >= self.sim_threshold):
                    matched = False
                    break
            if matched:
                candidates.append(y)
        
        return candidates

    def position_filtering(self, X, Y):
        prefix_y = []
        ids = []

        for i, y in enumerate(Y):
            is_chosen = True
            chosen_y = []
            for j in range(self.num_fields_checked):
                t = get_prefix_threshold(X[j], y[j], self.sim_threshold)

                if t:
                    chosen_y.append(t)
                else:
                    is_chosen = False
            if is_chosen:
                prefix_y.append(chosen_y)
                ids.append(i)

        frequent_prefix_y = []
        min_prefix = [99999 for _ in range(self.num_fields_checked)]
        for y in prefix_y:
            y_ = []
            for i in range(self.num_fields_checked):
                y_.append(sort_by_frequency(self.inverted_indices[i], y[i][0])[:len(y[i][0]) - y[i][1] + 1])
                if y[i][1] < min_prefix[i]:
                    min_prefix[i] = y[i][1]

            frequent_prefix_y.append(y_)

        inverted_freq_prefix_y = []
        frequent_prefix_x = []
        for i in range(self.num_fields_checked):
            inverted_freq_prefix_y.append(build_inverted_index([y[i] for y in frequent_prefix_y]))
            frequent_prefix_x.append(sort_by_frequency(self.inverted_indices[i], X[i]))

        filtered_y = []

        for i in range(self.num_fields_checked):
            y_filter_id = []
            for item in frequent_prefix_x[i][:len(frequent_prefix_x[i]) - min_prefix[i] + 1]:
                if item in inverted_freq_prefix_y[i]:
                    y_filter_id += inverted_freq_prefix_y[i][item]
            filtered_y.append(y_filter_id)

        Y_set_id = set(filtered_y[0])
        for y_filter_id in filtered_y[1:]:
            Y_set_id.intersection_update(y_filter_id)

        return [Y[ids[i]] for i in Y_set_id]
    
    
