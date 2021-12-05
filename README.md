# 🚀 Kindle to Notion 
### A way to seamlessly transfer your Kindle highlights to Notion Database!

# 🤖 Environment
```
Node v16.13.0
```

# ⚙️ Setup
- Copy my [Books Database Template](https://arkalim.notion.site/346be84507ff482b80fceb4024deadc2?v=e868075eaf5749bc941e617e651295fb) to your Notion dashboard 
- Clone the repository to your local system 
  ``` 
  git clone https://github.com/arkalim/kindle-to-notion.git
  ```
-  Move to your local repository
   ``` 
   cd kindle-to-notion
   ```
-  Install dependencies
   ``` 
   npm install
   ```
- Rename these files or folders by removing ```.example``` extension as shown below:
  - ```cache.example``` ➡ ```cache```
  - ```data.example``` ➡ ```data```
  - ```.env.example``` ➡ ```.env```

- Get your Notion API key at https://www.notion.so/my-integrations and create a new **internal integration**.
![](/resources/images/book-highlights-integration.png)
- Go to your Notion dashboard. Navigate to the Books database. Click on **Share** in the top right hand corner and invite the integration you just created.
![](/resources/images/adding-integration-to-database.png)
- Copy the link to the Notion books database and extract the Database Id as shown below
  ```
  Original Link: https://www.notion.so/arkalim/346be84507ff482b80fceb4024deadc2?v=e868075eaf5749bc941e617e651295fb
  Database Id: 346be84507ff482b80fceb4024deadc2
  ```
- Populate these environment variables in ```.env``` file
  ```
  NOTION_API_KEY=your-notion-api-key
  BOOK_DB_ID=your-book-database-id
  ```
- Connect your **Kindle** to your computer. Navigate to ```Kindle``` ➡ ```documents``` and copy ```My Clippings.txt```. Replace my ```My Clippings.txt``` in ```resources``` folder with yours.

# 🔁 Sync Highlights
Run the following command to watch your highlights teleport!
```
npm start
```
# ❗️For Nerds
- Every highlight made on Kindle is appended at the end of ```My Clippings.txt```
- ```Book Name``` is used as the primary key to facilitate upsert operation in **Notion** database. So, this field should be left untouched. However, the other fields like **Title**, **Author**, **Date Started**, **Date Finished**, **Satus** and **Genre** could be modified as per your wish.
- This tool only syncs the new highlights made to each book. If no new highlights have been made, no sync takes place. 
- The info about the last sync is stored in ```sync.json``` present in ```cache``` folder.
- In case you wish to sync every book all over again, you need to empty the array present in ```sync.json``` and delete all the highlights present in your **Notion** database before running the sync. 
- Responses from Notion API calls are exported to files with ```.json``` extension in ```data``` folder. This was done to mitigate the problem of effectively logging JSON objects in the console (terminal).