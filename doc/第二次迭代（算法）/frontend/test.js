import React, { Component } from 'react';
import $ from "jquery"

class test extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            image:''
        }
    }

    hello(){
        var s;
        $.ajaxSetup({
            async: false
        });
        $.post("http://127.0.0.1:6230",
            function(data){
                s=data;
            }.bind(this))
        $.ajaxSetup({
            async: true
        });
        alert(s)
    }

    buildDB(){
        $.post("http://127.0.0.1:5000/buildDB",
            function(data){
            }.bind(this))
    }

    setImg(img){
        this.setState({image:img})
    }

    upload(){
        var file =document.getElementById("upload").files[0];
        if(!/image\/\w+/.test(file.type)){
            alert("请确保文件为图像类型");
            return false;
        }
        var r=new FileReader();
        r.readAsDataURL(file);
        r.onload=function(){
            $.post("http://127.0.0.1:5000/getLabel", {pic:r.result.split(",")[1]},
                function(data){
                    this.setImg(data);

                    //window.location.reload()
                }.bind(this))
        }.bind(this)
    }

    render(){
        return(
            <div class="first-key">
                <input type={'file'} id={'upload'} name="upload"/>
                <button onClick={this.upload.bind(this)}>上传</button>
                <button onClick={this.hello.bind(this)}>hello</button>
                <button onClick={this.buildDB.bind(this)}>建数据库</button>
                <div>
                    <img src={'data:image/jpg;base64,'+ this.state.image}/>
                </div>
            </div>
            )
    }
}
export default test;