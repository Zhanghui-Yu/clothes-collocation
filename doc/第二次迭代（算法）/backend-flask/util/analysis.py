import numpy as np


class Analysis:
    def __init__(self):
        self.types = ('texture', 'fabric', 'shape', 'part', 'style')
        self.tags_dict = {}
        for attr_type in self.types:
            with open("./util/label/{0}.txt".format(attr_type), "r") as f:
                attr = f.read().strip().split()
                self.tags_dict[attr_type] = attr

    def analysis_attr(self, attrs):
        label = {}
        for attr_type in self.types:
            label[attr_type] = self.analysis_one(attrs[attr_type], attr_type)
        return {
            "attr": self.discretize_attr(self.merge(attrs)),
            "label": self.merge(label)
        }

    @staticmethod
    def discretize_attr(attr):
        attr_np = np.array(attr)
        attr_np /= np.sqrt(np.sum(np.square(attr_np)))
        # print(np.sum(np.square(attr_np)))
        return attr_np.tolist()

    def analysis_one(self, attr, attr_type):
        tags = self.tags_dict[attr_type]

        # strategy one: only return largest one
        # ret = [tags[attr.index(max(attr))]]
        ret = [attr.index(max(attr))]

        # strategy two: set a threshold
        # threshold = 0.3
        # ret = map(lambda y: tags[attr.index(y)], filter(lambda x: x > threshold, attr))

        return ret

    def merge(self, parts):
        ret = []
        for attr_type in self.types:
            ret += parts[attr_type]
        return ret
