import os, sys
import subprocess

def conc_files(dir):
    master_list = []
    for filename in os.listdir(dir):
         if (os.path.isfile(os.path.join(dir, filename))):
            master_list.append(filename)
    return master_list

def read_data(input_file):
    file = open(input_file)
    data = file.read()
    file.close()
    return data

def filter_reports(input_list, dir):
    root_url = "ftp://ftp.sec.gov/"
    for filename in input_list:
        data = read_data((os.path.join(dir, filename)))

        # go line-by-line
        newlines = data.split("\n")
        for line in newlines:

            #filtering magic happens here

            # for 10Q
            if (line[:4] == "10-Q"):
                columns = line.strip().split(" ")
                # last column will be our url
                #print columns[len(columns) - 1]
                subprocess.call(['touch', dir + '10Q-wget.txt'])
                output = open(dir + '10Q-wget.txt', 'a')
                output.write(root_url + columns[len(columns) - 1] + '\n')

            #for 10K
            if (line[:3] == "10K"):
                columns = line.strip().split(" ")
                # last column will be our url
                #print columns[len(columns) - 1]
                subprocess.call(['touch', dir + '10K-wget.txt'])
                output = open(dir + '10K-wget.txt', 'a')
                output.write(root_url + columns[len(columns) - 1] + '\n')




if __name__ == '__main__':
    master_list = conc_files("data/idx")
    filter_reports(master_list, "data/idx")
