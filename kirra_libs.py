import os, json, sys
from spacy.lang.id import stop_words, Indonesian

def getAllFileinFolder(folderpath):
    filelist = []
    for file in os.listdir("{}".format(folderpath)):
        if file.endswith(".txt"):
            filelist.append(file)
            # print(os.path.join("/mydir", file))
    return filelist

def extractFile(filename):
    sentence = []
    jsonline = open("{}/{}".format(SOURCE_DATA, filename), "r").readlines()
    asa = 1
    for x in jsonline:
        try:  # try parsing to dict
            dataform = str(x).strip("'<>() ").replace('\'', '').replace('\0', '')
            struct = json.loads(dataform)
            for s in struct:
                # for cc in sentenceToken(s["description"]):
                # sentence.append(s["category"].strip())
                sentence.append(s["category"].strip().replace(" ","") +" "+s["description"].strip())
                # sentence.append(s["description"])
                # for cc in tokenSentence(s["description"]):
                #     # print(cc)
                #     datatmp = "" + cc.replace("\t", "").replace("\n", "").replace("\r", "").replace("\v", "").replace(
                #         "\f", "").replace('"', '').replace("#", "").replace("&nbsp;", "")
                #     if datatmp.startswith(","):
                #         datatmp = datatmp[1:]
                #     sentence.append(' '.join(datatmp.split()))
                #     # print(s["description"])
                #     # print(s["title"])
                #     # break
        except:
            # print(x)
            print(asa)
            asa += 1
            pass
            print(sys.exc_info())
    return sentence


def getText(thname, list):
    alldata = []
    print(len(list))
    for x in list:
        print(thname, x)
        alldata += extractFile(x)
    writedataa(alldata, thname)


def writedataa(list, thname):
    file = open("sentence_rep_{}.txt".format(thname), "w");
    for x in sorted(set(list)):
        # for x in list:
        # hasil = x.replace('"','').replace("#","").replace("&nbsp;","" )
        file.write(x + "\n")
    file.close()

def checkdata():
    allsentences = []
    listfile = getAllFileinFolder(SOURCE_DATA)
    i = 0
    for y in listfile:
        print(i / len(listfile))
        i += 1
        allsentences += extractFile(y)
        print(y)
        # break


    # tmp = [x for x in allsentences if "halaman" not in x]
    # from collections import Counter
    # allsentences = [x for x in allsentences if "halaman" not in x and "Halaman" not in x]
    # print(Counter(allsentences))
    # print(set(allsentences))
    hasilakhir = list(set(allsentences))
    # print((hasilakhir))
    print(len(hasilakhir))
    # print(set(tmp))
    # print(len(set(tmp)))

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