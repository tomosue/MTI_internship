#!/bin/bash

lambda_deploy(){
    cd lambda
    for lambdaf in *.js 
    do
      fname=$(echo $lambdaf | sed s/.js//)
      if [ $fname.a != "*.a" ]
      then
        mkdir $fname
        mv ${fname}.js ${fname}
      fi
    done

    for lambdaf in */ ;
    do
      fname=$(echo $lambdaf | sed s:/*$::)
      cd ${fname}
      zip -r ../${fname}.zip .
      cd ..
      aws lambda create-function  --function-name ${fname} \
        --runtime nodejs14.x \
        --role arn:aws:iam::347867041416:role/internship_exec_role \
        --handler ${fname}.handler  --zip-file fileb://${fname}.zip \
        --region ap-northeast-1
      rm ${fname}.zip
    done
    cd ..
}

lambda_update(){
    cd lambda
    for updatelist in */
    do
        funame=$(echo $updatelist | sed s:/*$::)
        echo ${funame}の更新
        cd ${funame}
        zip -r ../${funame}.zip .
        cd ..
        aws lambda update-function-code --function-name ${funame} --zip-file fileb://${funame}.zip
        rm ${funame}.zip
    done
    cd ..
}

case $1 in
    lambda_deploy) lambda_deploy;;
    lambda_update) lambda_update;;
esac
