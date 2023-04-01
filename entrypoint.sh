#! /bin/bash

export NOTION_API_KEY=$INPUT_NOTION_API_KEY
export BOOK_DB_ID=$INPUT_BOOK_DB_ID

node dist/main.js