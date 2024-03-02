"use strict";

// tiny mce plugin customization
tinymce.init({
    selector: 'textarea#basic-example',
    statusbar: false,
    menubar:false,
    promotion:false,
    contextmenu:false,
    toolbar: false,
    height: '95%',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'wordcount', 'wordcount'
    ],
    toolbar: 'bold italic backcolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' +'undo redo | blocks forecolor wordcount| ' +
    'removeformat | '
  });
  tomSelect()
  var para = {
    allowEmptyOption: true,
	  create: false
  };


  function tomSelect()
  {
    document.querySelectorAll('.select').forEach((el)=>{
        let settings = {}
        new TomSelect(el,(settings,para));
      });
  }



  //Side navbar
  $(document).ready(function(){
    if ($(window).width() < 992) {
    let collapse_icon = document.querySelector('.collapse-icon');
    let close = document.querySelector('.close');
    let sidenav = document.querySelector('#sidenav');
    let overlay = document.querySelector('#overlay');

    let classOpen = [sidenav, overlay];
    collapse_icon.addEventListener('click', function(e){
        classOpen.forEach(e => e.classList.add('active'));
    });

        let classCloseClick = [overlay, close];
        classCloseClick.forEach(function(el) {
            el.addEventListener('click', function(els) {
                classOpen.forEach(els => els.classList.remove('active'));
            });
        });
    }
});

// profile image
function preview() {
    frame.src=URL.createObjectURL(event.target.files[0]);
}
// toggle bar

var shrink_btn = document.querySelector(".shrink-btn");
let activeIndex;
if(shrink_btn) {
    shrink_btn.addEventListener("click", () => {
        document.body.classList.toggle("shrink");
        setTimeout(moveActiveTab, 400);
        shrink_btn.classList.add("hovered");
        setTimeout(() => {
            shrink_btn.classList.remove("hovered");
        }, 500);
    });
}

function moveActiveTab() {
    let topPosition = activeIndex * 58 + 2.5;
    if (activeIndex > 3) {
        topPosition += shortcuts.clientHeight;
    }
}
// Theme change
document.querySelector('#switch').addEventListener('click', function() {
    var wasDarkMode = localStorage.getItem('dark') === '1';
    localStorage.setItem('dark', wasDarkMode ? '0' : '1');
    document.documentElement.classList[wasDarkMode ? 'remove' : 'add']('dark');
});
// Theme change end

// scroll to left right template menu

  const navScroller = function({
      wrapperSelector: wrapperSelector = '.nav-scroller-wrapper',
      selector: selector = '.nav-scroller',
      contentSelector: contentSelector = '.nav-scroller-content',
      buttonLeftSelector: buttonLeftSelector = '.nav-scroller-btn--left',
      buttonRightSelector: buttonRightSelector = '.nav-scroller-btn--right',
      scrollStep: scrollStep = 300
  } = {}) {
      let scrolling = false;
      let scrollingDirection = '';
      let scrollOverflow = '';
      let timeout;
      let navScrollerWrapper;
      if (wrapperSelector.nodeType === 1) {
          navScrollerWrapper = wrapperSelector;
      } else {
          navScrollerWrapper = document.querySelector(wrapperSelector);
      }
      if (navScrollerWrapper === undefined || navScrollerWrapper === null) return;
      let navScroller = navScrollerWrapper.querySelector(selector);
      let navScrollerContent = navScrollerWrapper.querySelector(contentSelector);
      let navScrollerLeft = navScrollerWrapper.querySelector(buttonLeftSelector);
      let navScrollerRight = navScrollerWrapper.querySelector(buttonRightSelector);
      // Sets overflow
      const setOverflow = function() {
          scrollOverflow = getOverflow(navScrollerContent, navScroller);
          toggleButtons(scrollOverflow);
      }
      // Debounce setting the overflow with requestAnimationFrame
      const requestSetOverflow = function() {
          if (timeout) {
              window.cancelAnimationFrame(timeout);
          }
          timeout = window.requestAnimationFrame(() => {
              setOverflow();
          });
      }
      // Get overflow value on scroller
      const getOverflow = function(content, container) {
          let containerMetrics = container.getBoundingClientRect();
          let containerWidth = containerMetrics.width;
          let containerMetricsLeft = Math.floor(containerMetrics.left);
          let contentMetrics = content.getBoundingClientRect();
          let contentMetricsRight = Math.floor(contentMetrics.right);
          let contentMetricsLeft = Math.floor(contentMetrics.left);
          // Offset the values by the left value of the container
          let offset = containerMetricsLeft;
          containerMetricsLeft -= offset;
          contentMetricsRight -= offset + 1; // Due to an off by one bug in iOS
          contentMetricsLeft -= offset;
          if (containerMetricsLeft > contentMetricsLeft && containerWidth < contentMetricsRight) {
              return 'both';
          } else if (contentMetricsLeft < containerMetricsLeft) {
              return 'left';
          } else if (contentMetricsRight > containerWidth) {
              return 'right';
          } else {
              return 'none';
          }
      }
      // Move the scroller with a transform
      const moveScroller = function(direction) {
          if (scrolling === true) return;
          setOverflow();
          let scrollDistance = scrollStep;
          let scrollAvailable;
          if (scrollOverflow === direction || scrollOverflow === 'both') {
              if (direction === 'left') {
                  scrollAvailable = navScroller.scrollLeft;
              }
              if (direction === 'right') {
                  let navScrollerRightEdge = navScroller.getBoundingClientRect().right;
                  let navScrollerContentRightEdge = navScrollerContent.getBoundingClientRect().right;
                  scrollAvailable = Math.floor(navScrollerContentRightEdge - navScrollerRightEdge);
              }
              // If there is less that 1.5 steps available then scroll the full way
              if (scrollAvailable < (scrollStep * 1.5)) {
                  scrollDistance = scrollAvailable;
              }
              if (direction === 'right') {
                  scrollDistance *= -1;
              }
              navScrollerContent.classList.remove('no-transition');
              navScrollerContent.style.transform = 'translateX(' + scrollDistance + 'px)';
              scrollingDirection = direction;
              scrolling = true;
          }
      }
      // Set the scroller position and removes transform, called after moveScroller()
      const setScrollerPosition = function() {
          var style = window.getComputedStyle(navScrollerContent, null);
          var transform = style.getPropertyValue('transform');
          var transformValue = Math.abs(parseInt(transform.split(',')[4]) || 0);

          if (scrollingDirection === 'left') {
              transformValue *= -1;
          }
          navScrollerContent.classList.add('no-transition');
          navScrollerContent.style.transform = '';
          navScroller.scrollLeft = navScroller.scrollLeft + transformValue;
          navScrollerContent.classList.remove('no-transition');
          scrolling = false;
      }
      // Toggle buttons depending on overflow
      const toggleButtons = function(overflow) {
          navScrollerLeft.classList.remove('active');
          navScrollerRight.classList.remove('active');
          if (overflow === 'both' || overflow === 'left') {
              navScrollerLeft.classList.add('active');
          }
          if (overflow === 'both' || overflow === 'right') {
              navScrollerRight.classList.add('active');
          }
      }
      const init = function() {
          // Determine scroll overflow
          setOverflow();
          // Scroll listener
          navScroller.addEventListener('scroll', () => {
              requestSetOverflow();
          });
          // Resize listener
          window.addEventListener('resize', () => {
              requestSetOverflow();
          });
          // Button listeners
          navScrollerLeft.addEventListener('click', () => {
              moveScroller('left');
          });
          navScrollerRight.addEventListener('click', () => {
              moveScroller('right');
          });
          // Set scroller position
          navScrollerContent.addEventListener('transitionend', () => {
              setScrollerPosition();
          });
      };
      // Init is called by default
      init();
      // Reveal API
      return {
          init
      };
  };
  const navScrollerTest = navScroller();
    // copy text input
function clipboard(elem, event) {
    elem.prev('input[type="text"]').focus().select();
    document.execCommand(event);
    elem.prev('input[type="text"]').blur();
    elem.addClass('clicked');
    $('.copy-text').addClass('hidden');
  }
  $('.btn-copy').on('click', function(){
    clipboard($(this), 'copy')
  });



//   radio button click
  $(window).on('load', function() {
      if($("#radio-option-1").prop("checked")){
        $("#twoCarDiv").show();
        $("#threeCarDiv").hide();
    }

    $("input[name$='cards']").on('click', function() {
        var test = $(this).val();
        $(".package-description").hide();
        $("#" + test).show();
    });
});
//
$(".profile-back").on('click', function() {
    $("#account-sidebar").removeClass("hidden md:block");
    $(".main-profile-content").addClass("hidden md:block")
})
