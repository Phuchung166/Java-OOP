package com.example.demo.controller;

import java.util.*;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
// import org.springframework.web.bind.annotation.RestController;

@Controller
public class DemoController {
    @GetMapping("/api/data")
    @ResponseBody
    public Map<String, Object> getGeoData() {
        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "LineString");
        geometry.put("coordinates", new double[][] {
                { 21.028511, 105.804817 }
        });

        Map<String, Object> properties = new HashMap<>();
        properties.put("tennhan",
                "Sạt lở đoạn K60-K60+200 đê tả sông Cầu, thôn Trúc Tay, xã Vân Trung, huyện Việt Yên.");
        properties.put("loai_diadiem", "Bờ sông");
        properties.put("chieudai", 30);
        properties.put("tacdong", "Sạt gần bãi vật liệu");
        properties.put("diadiem", "Trúc Tay");
        properties.put("ten_tinh", "Bắc Giang");
        properties.put("trangthai", 66);
        properties.put("ghichu",
                "Chưa ảnh hưởng đến hạ tầng, kinh tế, tuy nhiên đã sạt gần vị trí bãi tập kết vật liệu của địa phương.");
        properties.put("thuocsong", "Sông Cầu");
        properties.put("huyenref", "Việt Yên");
        properties.put("xaref", "Vân Trung");

        Map<String, Object> response = new HashMap<>();
        response.put("type", "Feature");
        response.put("geometry", geometry);
        response.put("properties", properties);

        return response; // Spring will convert this to JSON
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }


    // @GetMapping("/")
    // public String home() {
    //     return "index";
    // }
}