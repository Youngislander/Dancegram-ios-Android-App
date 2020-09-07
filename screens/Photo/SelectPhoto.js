import React, { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import Loader from "../../components/Loader";
import constants from "../../constants";
import styles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { set } from "react-native-reanimated";

const View = styled.View`
  flex: 1;
`;

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  margin-top: 20px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;


export default () => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState();
  const [selectArray, setSelectArray] = useState([]);
  const [allPhotos, setAllPhotos] = useState();
  const navigation = useNavigation();

  const changeSelected = async photo => {
    await setSelected(photo);
    setSelectArray(selectArray => selectArray.concat(selected));
    console.log(selectArray);
  }
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
    } catch(e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if(status === "granted") {
        setHasPermission(true);
        getPhotos();
      }
    } catch(e){
      console.log(e);
      setHasPermission(false);
    }
  };
  const handleSelected = () => {
    navigation.navigate("UploadPhoto", {photo: selectArray});
  };
  useEffect(() => {
    askPermission();
  },[]);
  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
       <View>
        {hasPermission ? (
         <>
           <Image 
             style={{ width: constants.width, height: constants.height/2 }}
             source={{ uri: selected.uri }}
           />
           <Button onPress={handleSelected}>
             <Text>Select photo</Text>
           </Button>
           <ScrollView 
              contentContainerStyle={{ 
                flexDirection: "row",
                flexWrap: "wrap" 
              }}
           >
             {allPhotos.map(photo => (
              <TouchableOpacity
                key={photo.id}
                onPress={() => changeSelected(photo)}
              >
               <Image 
                 key={photo.id}
                 source={{ uri: photo.uri }}
                 style={{
                   width: constants.width/3,
                   height: constants.height/6,
                   opacity: () => {
                        for(i = 0; i < allphotos.length-1; i++){
                        if(photo.id === selectArray[i].id){
                          return 0.5
                        } else{
                          return 1
                        }
                      }
                    }
                 }}
               />
              </TouchableOpacity>
             ))}
           </ScrollView>
         </>
        ) : null } 
        </View>
       )}
    </View>
  );
};

