from __future__ import print_function


import numpy as np
import pandas as pd
import nltk
import re
import os
import codecs
from sklearn import feature_extraction
import mpld3
import re, os, json, sys
import pandas as pd
from sklearn.cluster import KMeans
# from sklearn.metrics import adjusted_rand_score
from spacy.lang.id import stop_words
from spacy.lang.id import stop_words, Indonesian
from sklearn.feature_extraction.text import TfidfVectorizer
from spacy.lang.id import stop_words
from string import punctuation, digits
from sklearn.externals import joblib
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

import os  # for os.path.basename

import matplotlib.pyplot as plt
import matplotlib as mpl

from sklearn.manifold import MDS
from gensim import corpora, models, similarities
