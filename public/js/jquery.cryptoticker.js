/*
* Author: Patrick Scott
* File: cryptoticker.js
* Github: @pkellz
* Description: Customizable jQuery widget that lets you retrieve live
* prices, market caps, and % changes of cryptocurrencies from the CoinMarketCap API
*/

//slide less / none at all if there is room in the window
(function($)
{
  $.fn.cryptoticker = function(options)
  {
    let settings = {
      id:null,                    // search by id ("bitcoin" for example) - can only return one coin at a time
      getTopCoins:null,           // return n coins - overrides 'top5' and 'top10' but not 'id'- default 10 coins
      startIndex:0,               // default startIndex is 0, most likely 'bitcoin'
      top5:false,                 // returns top 5 coins by market cap - will not set if any of the above is already set
      top10:false,                // returns top 10 coins by market cap - will not set if any of the above is already set
      speed:10000,                // time until slide ends - default 30 seconds
      fadeInOutSpeed:2500,        // time it takes to fade out after slide animation ends - default 2.5 seconds,
      resetSpeed:1000,            // time it takes for the ticker to reset position after fading out - default 1 second
      separatorColor: '#555',  // default separator color
      separatorWidth:1,           // default separator width (px)
      nameColor:'#F9B016',        // default name color
      priceColor:'#ffffff',       // default price color
      capColor:'#ffffff',         // default market cap color
    }

    $.extend(settings, options);

    const api = 'https://api.coinmarketcap.com/v1/ticker/'
    let endpoint;

    //Remember 'id' needs a '/' but ?limit=n does not
    if(settings.id)
      endpoint = `${settings.id.toLowerCase()}/`
    else if(settings.getTopCoins)
      endpoint = `?start=${settings.startIndex}&limit=${settings.getTopCoins}`;
    else if(settings.top5)
      endpoint = `?start=${settings.startIndex}&limit=5`
    else if(settings.top10)
      endpoint = `?start=${settings.startIndex}&limit=10`
    else
      endpoint = `?start=${settings.startIndex}&limit=10` //default query if no matching options are provided

    let url = api+endpoint
    fetchData(url,this,settings)
  }
})(jQuery)

function fetchData(url,_this,settings)
{
  console.log("Fetching New Data");
  fetch(url)
  .then(res=>
  {
    if(res.status !== 200)
    {
      console.log("Invalid Coin or Bad Request");
      throw new err
    }
    else
      return res.json()
  })
  .then(data=>
  {
    renderData(data,_this,settings,url)
  })
  .catch(()=>
  {
    console.log('caught')
  })
}

function renderData(data,_this,opts,url)
{
  // _this.empty();
  console.log(_this.children("ul"));
  if(_this.children("ul").length == 0)
    _this.append("<ul>");

  data.forEach((data, index)=>
  {
    let { name,
          percent_change_24h: pct_24,
          market_cap_usd:mktCap,
          price_usd: price,
          symbol
        } = data
    //variable to determine if the pct_24 was positive or negative
    const pctChangeSign = pct_24.split('')[0] == '-' ? 'pct_down' : 'pct_up'
    const arrow = pctChangeSign == 'pct_down' ? 'fa-caret-down' : 'fa-caret-up'
    //make sure pct_24 has 2 decimal places
    if (pct_24.split('.')[1].length != 2)
      pct_24 = pct_24 + '0';
    //get rid of trailing 0
    mktCap = mktCap.split('.')[0].split('')
    //add commas
    for(let i = mktCap.length-3; i > 0; i-=3)
    {
      mktCap.splice(i,0,',')
    }
    mktCap = mktCap.join('');

    _this.children('ul').append(`
    <li>
      <div class="coin" style="border-right:${opts.separatorWidth}px solid ${opts.separatorColor}">
      <div class="top">
        <span class="name" style="color:${opts.nameColor}">
          <a href="https://coinmarketcap.com/currencies/${name}/" target="_blank">${name.toUpperCase()}(${symbol})</a>
        </span>
        <span class="price" style="color:${opts.priceColor}">$${price}</span>
      </div>
      <div class="bottom">
        <span class="cap" style="color:${opts.capColor}">$${mktCap}</span>
        <span class="${pctChangeSign}">
          ${pct_24}%
          <i class="fa ${arrow}"></i>
        </span>
      </div>
    </div>
  </li>`);

    //expand ul to accomodate the newest li width
    let newestLiWidth = _this.find("li:last-child").css('width')
    _this.children("ul").css({'width':'+='+newestLiWidth});
  })
  beginSliding(_this,opts,url)
}
function beginSliding(_this,opts,url)
{
  let ul = _this.find("ul")
  let { speed, fadeInOutSpeed, resetSpeed } = opts;
  ul.animate({'opacity':'1'},fadeInOutSpeed);

  let ulWidth = _this.css('width')
  ul.animate({'margin-left':`-=${ulWidth}`},speed, ()=>
  {

    ul.animate({'opacity':'0'},fadeInOutSpeed);
    ul.empty();
    ul.remove();
    ul.animate({'margin-left':'0px'},resetSpeed);
    // ul.remove();
    fetchData(url,_this,opts);
    // beginSliding(_this,opts)
  })
}