package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.demo.model.FinalResult;
import com.example.demo.service.FinalResultService;
import org.springframework.web.bind.annotation.PostMapping;


@Controller
public class MyController {

    @Autowired
    private FinalResultService f;

    @PostMapping("/submit-cities")
    @ResponseBody
    public FinalResult getFinalResult(
        @RequestParam(name = "cities", required = false) List<String> cities,
        @RequestParam(name = "construction_types", required = false) List<String> constructionTypes
    ){
        if (cities == null) cities = new ArrayList<>();
        if (constructionTypes == null) constructionTypes = new ArrayList<>();

        List<String> types = new ArrayList<>();

        for (int i = 0; i < constructionTypes.size(); i++) {
            try {
                String[] temp = constructionTypes.get(i).split("\\s+");
                types.add(temp[0]);
                constructionTypes.set(i, temp[1]);
            } catch (Exception e) {
                
            }
        }

        FinalResult finalResult = f.generateFinalResult(cities, types, constructionTypes);
        return finalResult;
    }
}
