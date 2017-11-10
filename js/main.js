$(function(){
    loadImage();
    scroll();

    $(window).on('scroll resize', function(){
        var scrollHeight = 150,
            $header      = $('#header');
        if($(window).scrollTop() > scrollHeight) {
            $header.addClass('mini');
        } else {
            $header.removeClass('mini');
        }
    })

    function loadImage(){
        $('#gallery').each(function(){
            var $container    = $(this), //圖庫放置的容器
                $loadMoreBtn  = $('#load-more'), //載入更多的按鈕
                $filter       = $('#gallery-filter'), //篩選資料
                addItemCount  = 16, //一頁一次顯示的數量
                addedd        = 0, //顯示結束的項目數量
                allData       = [], //放所有的完整JSON資料
                filteredData  = []; //篩選後的JSON資料
            $container.masonry({
                columnWidth: 230, //每張圖的寬度
                gutter: 10, //間隙
                itemSelector: '.gallery-item'
            });
        // 取得JSON資料
        // initGallery      圖庫初始化
        // addItems(filter) 建立項目並插入文件
        // filterItems      項目篩選
        $.getJSON('../data/content.json', initGallery);

            function initGallery (data) {
                // 儲存取得的json
                allData = data;

                //初始狀態不做任何篩選
                filteredData = allData;

                //顯示初始的項目資料
                addItems();

                //點擊 Load-more按鈕後會顯示
                $loadMoreBtn.on('click', addItems);

                //篩選的 Radio button有變化的話，則重新篩選
                $filter.on('change', 'input[type="radio"]', filterItems);


            }
            function addItems(filter){
                var elements = [];
                var slicedData = filteredData.slice(addedd, addedd + addItemCount);
                $.each( slicedData, function(i, item){
                    var itemHtml =
                    '<li class="gallery-item isLoading">'+
                        '<a href="' + item.images.large +'">' +
                            '<img src="' + item.images.thumb + '" alt=""/>' +
                            '<span class="caption">' + 
                                '<span class="inner">' +
                                    '<b class="title">' + item.title + '</b>' +
                                    '<time class="date" datetime="' + item.date + '">' + 
                                        item.date.replace(/-0?/g, '/') +
                                    '</time>' +
                                '</span>' +
                            '</span>' +
                        '</a>' +
                    '</li>';
                    elements.push($(itemHtml).get(0));
                });

                $container
                    .append(elements)
                    .imagesLoaded(function () {
                        $(elements).removeClass('isLoading');
                        $container.masonry('appended', elements);

                        if (filter) { //篩選後重新配置
                            $container.masonry();
                        }
                    });
                // 增加 ColorBox Plugin
                $container.find('a').colorbox({
                    maxWidth: '970px',
                    maxHeight: '95%',
                    title: function() {
                        return $(this).find('.inner').html();
                    }
                });
                // 新增結束後更新項目數目
                addedd += slicedData.length;

                if (addedd < filteredData.length) {
                    $loadMoreBtn.show();
                } else {
                    $loadMoreBtn.hide();
                }

            }
            function filterItems(){
                var key = $(this).val(),
                    masonryItems = $container.masonry('getItemElements');
                
                $container.masonry('remove', masonryItems);
                
                filteredData = [];
                addedd = 0;

                if ( key === 'all' ){
                    filteredData = allData;
                } else {
                    filteredData = $.grep(allData, function (item) {
                        return item.category === key;
                    });
                } // End If
                
                addItems(true);
            }
        });
    };/*END of loadImage*/

    // jQuery UI Button
    $('.filter-form input[type="radio"]').button({
        icons: {
            primary: 'icon-radio'
        }
    });/*End of jQuery UI Button*/

    function scroll(){
        var $goTop = $('#go-top'),
            $header = $('#header'),
            showTop = 100;

        $goTop.on('click', function(e){
            e.preventDefault();
            $('body, html').stop().animate({
                scrollTop:'0'
            }, 500)
        });
        $(window).on('load scroll resize', function(){
            if ($(window).scrollTop() > showTop) {
                $goTop.fadeIn();
            } else {
                $goTop.fadeOut();
            }
        });
    };
});