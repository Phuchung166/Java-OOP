package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.demo.model.Image;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ImageService {
    
    public Image getImage(String id){
        Image image = new Image();
        WebClient builder = WebClient.builder().build();

        String url = "http://satlov2.vndss.com/Layer/getInfoImageVid?id="+id;

        try{
            String linkOfImage = builder
                        .get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

            linkOfImage = linkOfImage.substring(1, linkOfImage.length() - 1);
            ObjectMapper objectMapper = new ObjectMapper();
            image = objectMapper.readValue(linkOfImage, Image.class);            
        }
        catch(Exception e){
            e.printStackTrace();
        }
        
        return image;
    }
}
