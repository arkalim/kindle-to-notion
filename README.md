# 🚀 Kindle to Notion 
### A way to seamlessly transfer your Kindle highlights to Notion Database!

# 🔁 Usage
Before you can run the sync, you need to complete the setup section. Once you have docker setup, run the following command. Make sure to fill in the required placeholders.
```
docker run --rm -d \
-v <path-to-clippings-file>:/code/resources/My\ Clippings.txt \
-v cache:/code/cache \
-e NOTION_API_KEY=<your-notion-api-key> \
-e BOOK_DB_ID=<your-notion-db-id>
ghcr.io/arkalim/kindle-to-notion:master
```

# Setup

- Install Docker on your system.

- Get your Notion API key at https://www.notion.so/my-integrations and create a new **internal integration**.
![](/resources/images/book-highlights-integration.png)
- Go to your Notion dashboard. Navigate to the Books database. Click on **Share** in the top right hand corner and invite the integration you just created.
![](/resources/images/adding-integration-to-database.png)
- Copy the link to the Notion books database and extract the Database Id as shown below
  ```
  Original Link: https://www.notion.so/arkalim/346be84507ff482b80fceb4024deadc2?v=e868075eaf5749bc941e617e651295fb
  Database Id: 346be84507ff482b80fceb4024deadc2
  ```
- You will need these to run the sync.
- Connect your **Kindle** to your computer. Navigate to ```Kindle``` ➡ ```documents``` and copy ```My Clippings.txt```. Place it anywhere on your system. You will need it's path to run the sync.

# ❗️For Nerds
- Every highlight made on Kindle is appended at the end of ```My Clippings.txt```
- ```Book Name``` is used as the primary key to facilitate upsert operation in **Notion** database. So, this field should be left untouched. However, the other fields like **Title**, **Author**, **Date Started**, **Date Finished**, **Satus** and **Genre** could be modified as per your wish.
- This tool only syncs the new highlights made to each book. If no new highlights have been made, no sync takes place. 
- The info about the last sync is stored in ```sync.json``` present in ```cache``` folder.
- In case you wish to sync every book all over again, you need to empty the array present in ```sync.json``` and delete all the highlights present in your **Notion** database before running the sync. 
- Responses from Notion API calls are exported to files with ```.json``` extension in ```data``` folder. This was done to mitigate the problem of effectively logging JSON objects in the console (terminal).
- GitHub Action is used for CICD. Whenever a push is made to the master branch, the Docker image is rebuilt and pushed to GitHub packages repository.