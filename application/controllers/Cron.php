<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cron extends CI_Controller {
  

    function __construct(){
	   parent::__construct();
	   $this->pageIdentity = [
		   'title' => 'Coin Market Rise',
		   'site'  => 'CoinMarketRise'
	   ];
	}

	public function index()
	{   
		$data = array_merge(['page' => 'index'],$this->pageIdentity);
		$this->load->view('template/body',$data);
	}
}
