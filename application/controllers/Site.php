<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Site extends CI_Controller {
  

    function __construct(){
	   parent::__construct();
	   $this->pageIdentity = [
		   'title' => 'Coin Market Rise',
		   'site'  => 'CoinMarketRise'
	   ];
	   $this->load->helper('common');
	}

	public function index()
	{   
		$array['load_scripts'] = ['jquery.cryptoticker.js','scripts.js'];
		$array['load_styles']  = ['cryptoticker.css'];

		$array['page'] = 'index';
		$data = array_merge($array,$this->pageIdentity);
		$this->load->view('template/body',$data);
	}
}
