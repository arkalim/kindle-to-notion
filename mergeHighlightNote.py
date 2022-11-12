import linecache
filepath = './resources/My Clippings.txt'
with open(filepath, 'r') as f:
    data = f.readlines()
    for idx, line in enumerate(data, 1):
        if line != None and 'Your Note' not in line: 
            continue
        highlight = linecache.getline(filepath, idx-3).strip()
        note = linecache.getline(filepath, idx+2)
        merged = highlight + '    Note:    ' + note
        data[idx-4] = merged
        for i in [-3, 2]:
            data[idx+1] = "".strip()
with open(filepath, 'w') as f:
    f.writelines(data)