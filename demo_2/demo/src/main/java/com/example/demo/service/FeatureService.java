package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.demo.model.FeatureCollection;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FeatureService {
    
    public FeatureCollection getFeatureCollection(String city, String type, String type_struct){
        WebClient.Builder builder = WebClient.builder();
        FeatureCollection featureCollection = new FeatureCollection();
        String url = "http://satlov2.vndss.com/Layer/Api?type=" + type + "&sts=" + type_struct + "&matinh=" + city;
        System.out.println(url);
        try {
            String rawJson = builder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        
                String cleanedJson = rawJson.replace("\\", "");
                String tam = cleanedJson.substring(1, cleanedJson.length() - 1);
                ObjectMapper objectMapper = new ObjectMapper();
                featureCollection = objectMapper.readValue(tam, FeatureCollection.class);
            } catch (Exception e){
                e.printStackTrace();
            }

            return featureCollection;

        
    }
}
