package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Feature;
import com.example.demo.model.FeatureCollection;
import com.example.demo.model.FinalResult;
import com.example.demo.model.Image;
import com.example.demo.model.MiniFeature;
import com.example.demo.model.Result;

import java.util.*;

@Service
public class FinalResultService {
    
   @Autowired
   private FeatureService featureService;

   @Autowired
   private ImageService imageService;

   public FinalResult generateFinalResult(List<String> cities, List<String> types, List<String> type_structs){
      List<Result> results = new ArrayList<>();

      for (String x: cities){
         for (String y: types){
               for (String z: type_structs){
                  FeatureCollection featureCollection = featureService.getFeatureCollection(x, y, z);
                  List<Feature> listOfFeatures = featureCollection.getFeatures();

                  if (listOfFeatures == null){
                     listOfFeatures = new ArrayList<>();
                  }

                  List<MiniFeature> listMiniFeatures = new ArrayList<>();

                  for (Feature feature: listOfFeatures){
                     String id = feature.getProperties().getId();
                     Image image = imageService.getImage(id);
                     MiniFeature miniFeature = new MiniFeature(feature, image);
                     listMiniFeatures.add(miniFeature);
                  }

                  if (!listMiniFeatures.isEmpty()){
                     Result result = new Result(x, y, z, listMiniFeatures);
                     results.add(result);
                  }
               }
         }
      }

        return new FinalResult(results);
     }
}
