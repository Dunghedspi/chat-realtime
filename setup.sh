# !bin/bash

#install dependencies
# echo -ne "run npm install server--------\n"
# echo `npm install`



#copy server .env
FILE_CONFIG="$PWD/.env"
FILE_CONFIG_EXAMPLE="$PWD/.env.example"

if [ ! -f $FILE_CONFIG ]
  then
    echo `copy $FILE_CONFIG_EXAMPLE $FILE_CONFIG`
    echo -ne ".env.exampleファイルから .env ファイルがコピーされました。\n"
else
  echo -ne ".env ファイルが既に存在します\n"
fi

#copy fontend .env
FILE_FONT_CONFIG="$PWD/fontend/.env"
FILE_FONT_CONFIG_EXAMPLE="$PWD/fontend/.env.example"

if [ ! -f $FILE_FONT_CONFIG ]
  then
    echo `copy $FILE__FONT_CONFIG_EXAMPLE $FILE_FONT_CONFIG`
    echo -ne ".env.exampleファイルから .env ファイルがコピーされました。\n"
else
  echo -ne ".env ファイルが既に存在します\n"
fi


#setup project local
DIR="$PWD/uploads"
if [ ! -d $DIR ]
  then
    echo `mkdir -p $DIR/avatar $DIR/image`
    echo -ne "-----------------------------------\n"
    echo -ne "アップロードフォルダを作成されました。。。。\n"
else 
  echo -ne "アップロードフォルダが既に存在します\n"
fi

#link build folder reactjs
FONTEND_BUILD_PATH="$PWD/fontend/build"
`ln -s -f $FONTEND_BUILD_PATH $PWD/build`