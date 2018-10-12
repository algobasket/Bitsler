<?php
 
 if( ! function_exists('load_scripts')){
    function load_scripts($scripts){
        if(is_array($scripts)){
           foreach($scripts as $r){
            echo '<script src="'.base_url() . 'public/js/' .$r .'"></script>';
           }
        }
    }
 }

 if( ! function_exists('load_styles')){
    function load_styles($styles){
        if(is_array($styles)){
           foreach($styles as $r){ 
            echo '<link href="'.base_url() . 'public/css/' .$r .'" rel="stylesheet" type="text/css" />';
           }
        }
    }
 }
?>