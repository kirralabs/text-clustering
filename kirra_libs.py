import os
from spacy.lang.id import Indonesian
import fnmatch
def getAllFileinFolder(folderpath):
    filelist = []
    for dirpath, dirs, files in os.walk(folderpath):
        for filename in fnmatch.filter(files, '*.txt'):
            filelist.append(dirpath + "/" + filename)
    return filelist

def writedataa(list, thname):
    file = open("sentence_rep_{}.txt".format(thname), "w");
    for x in sorted(set(list)):
        # for x in list:
        # hasil = x.replace('"','').replace("#","").replace("&nbsp;","" )
        file.write(x + "\n")
    file.close()

nlp = Indonesian()
def tokenize_and_stem(text):
    text = u'{}'.format(text)
    doc = nlp(text)
    stems = [t.lemma_ for t in doc]
    stems = [t.lower() for t in stems]
    return stems


def tokenize_only(text):
    text = u'{}'.format(text)
    doc = nlp(text)
    stems = [t.text for t in doc]
    stems = [t.lower() for t in stems]
    return stems