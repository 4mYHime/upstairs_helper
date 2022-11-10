
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      setTimeout(function(){
        window.location.reload();
      }, 1000 * 60); //60秒刷新一次
    }
  };