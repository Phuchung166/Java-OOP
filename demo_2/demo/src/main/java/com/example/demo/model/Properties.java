package com.example.demo.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)

public class Properties {
    
    private String id;
    private String tennhan;
    // private String diadiem;
    private String tacdong;
    private int chieudai;
    // private String tenTinh;
    // private int trangthai;
    private Double lat;
    private Double lon;
    // private String ghichu;
    private String thoigian;
    // private Double kinhphi;
    private String giaiphap;
    // private String linePath;
    // private Double lengthDoan;
    // private String loaiDiadiem;
    // private String chieusau;
    // private Double chieurong;
    // private int thuocbien;
    private String huyenref;
    private String xaref;
    // private String nguonvon;
    private String thuocsong;
    // private String namxaydung;
    // private String namhoanthanh;
    // private String baovekhuvuc;
    // private String vatlieu;
    // private String mucdoondinh;
    // private String khananggayboi;
    // private String hinhthuc;
    // private Double soluongmatcat;
    // private Double tongkinhphi;
    // private String cokehoachhotro;
    // private String ketcau;
    // private Double kinhphiTrunguong;
    // private Double kinhphiDiaphuong;
    // private Double nguonvonDiaphuong;
    private Double length;
    private int sodoan;

    public String getId() {
        return id;
    }

    public void setId(String  id) {
        this.id = id;
    }

    public String getTennhan() {
        return tennhan;
    }

    public void setTennhan(String tennhan) {
        this.tennhan = tennhan;
    }

    // public String getDiadiem() {
    //     return diadiem;
    // }

    // public void setDiadiem(String diadiem) {
    //     this.diadiem = diadiem;
    // }

    public String getTacdong() {
        return tacdong;
    }

    public void setTacdong(String tacdong) {
        this.tacdong = tacdong;
    }

    public int getChieudai() {
        return chieudai;
    }

    public void setChieudai(int chieudai) {
        this.chieudai = chieudai;
    }

    // public String getTenTinh() {
    //     return tenTinh;
    // }

    // public void setTenTinh(String tenTinh) {
    //     this.tenTinh = tenTinh;
    // }

    // public int getTrangthai() {
    //     return trangthai;
    // }

    // public void setTrangthai(int trangthai) {
    //     this.trangthai = trangthai;
    // }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    // public String getGhichu() {
    //     return ghichu;
    // }

    // public void setGhichu(String ghichu) {
    //     this.ghichu = ghichu;
    // }

    public String getThoigian() {
        return thoigian;
    }

    public void setThoigian(String thoigian) {
        this.thoigian = thoigian;
    }

    // public Double getKinhphi() {
    //     return kinhphi;
    // }

    // public void setKinhphi(Double kinhphi) {
    //     this.kinhphi = kinhphi;
    // }

    public String getGiaiphap() {
        return giaiphap;
    }

    public void setGiaiphap(String giaiphap) {
        this.giaiphap = giaiphap;
    }

    // public String getLinePath() {
    //     return linePath;
    // }

    // public void setLinePath(String linePath) {
    //     this.linePath = linePath;
    // }

    // public Double getLengthDoan() {
    //     return lengthDoan;
    // }

    // public void setLengthDoan(Double lengthDoan) {
    //     this.lengthDoan = lengthDoan;
    // }

    // public String getLoaiDiadiem() {
    //     return loaiDiadiem;
    // }

    // public void setLoaiDiadiem(String loaiDiadiem) {
    //     this.loaiDiadiem = loaiDiadiem;
    // }

    // public String getChieusau() {
    //     return chieusau;
    // }

    // public void setChieusau(String chieusau) {
    //     this.chieusau = chieusau;
    // }

    // public Double getChieurong() {
    //     return chieurong;
    // }

    // public void setChieurong(Double chieurong) {
    //     this.chieurong = chieurong;
    // }

    // public int getThuocbien() {
    //     return thuocbien;
    // }

    // public void setThuocbien(int thuocbien) {
    //     this.thuocbien = thuocbien;
    // }

    public String getHuyenref() {
        return huyenref;
    }

    public void setHuyenref(String huyenref) {
        this.huyenref = huyenref;
    }

    public String getXaref() {
        return xaref;
    }

    public void setXaref(String xaref) {
        this.xaref = xaref;
    }

    // public String getNguonvon() {
    //     return nguonvon;
    // }

    // public void setNguonvon(String nguonvon) {
    //     this.nguonvon = nguonvon;
    // }

    public String getThuocsong() {
        return thuocsong;
    }

    public void setThuocsong(String thuocsong) {
        this.thuocsong = thuocsong;
    }

    // public String getNamxaydung() {
    //     return namxaydung;
    // }

    // public void setNamxaydung(String namxaydung) {
    //     this.namxaydung = namxaydung;
    // }

    // public String getNamhoanthanh() {
    //     return namhoanthanh;
    // }

    // public void setNamhoanthanh(String namhoanthanh) {
    //     this.namhoanthanh = namhoanthanh;
    // }

    // public String getBaovekhuvuc() {
    //     return baovekhuvuc;
    // }

    // public void setBaovekhuvuc(String baovekhuvuc) {
    //     this.baovekhuvuc = baovekhuvuc;
    // }

    // public String getVatlieu() {
    //     return vatlieu;
    // }

    // public void setVatlieu(String vatlieu) {
    //     this.vatlieu = vatlieu;
    // }

    // public String getMucdoondinh() {
    //     return mucdoondinh;
    // }

    // public void setMucdoondinh(String mucdoondinh) {
    //     this.mucdoondinh = mucdoondinh;
    // }

    // public String getKhananggayboi() {
    //     return khananggayboi;
    // }

    // public void setKhananggayboi(String khananggayboi) {
    //     this.khananggayboi = khananggayboi;
    // }

    // public String getHinhthuc() {
    //     return hinhthuc;
    // }

    // public void setHinhthuc(String hinhthuc) {
    //     this.hinhthuc = hinhthuc;
    // }

    // public Double getSoluongmatcat() {
    //     return soluongmatcat;
    // }

    // public void setSoluongmatcat(Double soluongmatcat) {
    //     this.soluongmatcat = soluongmatcat;
    // }

    // public Double getTongkinhphi() {
    //     return tongkinhphi;
    // }

    // public void setTongkinhphi(Double tongkinhphi) {
    //     this.tongkinhphi = tongkinhphi;
    // }

    // public String getCokehoachhotro() {
    //     return cokehoachhotro;
    // }

    // public void setCokehoachhotro(String cokehoachhotro) {
    //     this.cokehoachhotro = cokehoachhotro;
    // }

    // public String getKetcau() {
    //     return ketcau;
    // }

    // public void setKetcau(String ketcau) {
    //     this.ketcau = ketcau;
    // }

    // public Double getKinhphiTrunguong() {
    //     return kinhphiTrunguong;
    // }

    // public void setKinhphiTrunguong(Double kinhphiTrunguong) {
    //     this.kinhphiTrunguong = kinhphiTrunguong;
    // }

    // public Double getKinhphiDiaphuong() {
    //     return kinhphiDiaphuong;
    // }

    // public void setKinhphiDiaphuong(Double kinhphiDiaphuong) {
    //     this.kinhphiDiaphuong = kinhphiDiaphuong;
    // }

    // public Double getNguonvonDiaphuong() {
    //     return nguonvonDiaphuong;
    // }

    // public void setNguonvonDiaphuong(Double nguonvonDiaphuong) {
    //     this.nguonvonDiaphuong = nguonvonDiaphuong;
    // }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public int getSodoan() {
        return sodoan;
    }

    public void setSodoan(int sodoan) {
        this.sodoan = sodoan;
    }

    public Properties(){

    }

}
