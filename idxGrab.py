import wget
import os


root_url = "ftp://ftp.sec.gov/edgar/full-index/"#2005/QTR3/form.idx"
os.chdir('data/idx') #download everything here

def grabIdx(root_url):
    for year in range (1993, 2015):
        for quarter in range (1, 4):
            local_url = root_url + str(year) + "/" + "QTR" + str(quarter) + "/form.idx"

            # save form in data
            try:
                wget.download(local_url)
            except:
                print "%s failed, skipping..." % local_url
                pass

if __name__ == '__main__':
    grabIdx(root_url)

