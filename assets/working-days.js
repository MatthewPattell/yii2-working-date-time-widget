/**
 * Created by Yarmaliuk Mikhail on 23.10.2017.
 */

(function( $ ){

    let settings = {};

    let methods = {
        init : function(options) {

            settings = $.extend(settings, options);

            let self = $(this);

            self.find('.time-work, .time-dinner')
                .inputmask('09.19 - 09.19', {
                    placeholder: "00.00 - 00.00",
                    definitions: {
                        '0': {
                            validator: "[0-2]",
                            cardinality: 1
                        },
                        '1' : {
                            validator: "[0-5]",
                            cardinality: 1
                        }
                    }
                })
                .bind('keyup.WorkingDays', function(e) {
                    if ( (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 8 || e.keyCode === 13 || e.ctrlKey ) {
                        _setValue($(this).closest('.option'));
                    }
                });

            self.find('div.option').bind('click.WorkingDays', function(e) {
                if(e.target.nodeName === 'DIV') {
                    _setValue($(this), true);
                }
            });
        },
    };

    let _setValue = function (option, toggle) {
        let status = option.hasClass('active'),
            inputW = option.find('input.time-work'),
            inputD = option.find('input.time-dinner');

        let realInputW = option.find('.realW'),
            realInputD = option.find('.realD');

        if (toggle !== true) {
            if (!inputW.val().length && !inputD.val().length) {
                option.add(inputW).add(inputD)
                    .addClass('inactive')
                    .removeClass('active');
            } else {
                option
                    .removeClass('inactive')
                    .addClass('active');

                inputW
                    .removeClass(!inputW.val().length ? 'active' : 'inactive')
                    .addClass(inputW.val().length ? 'active' : 'inactive');

                inputD
                    .removeClass(!inputD.val().length ? 'active' : 'inactive')
                    .addClass(inputD.val().length ? 'active' : 'inactive');

            }

            realInputW.val(inputW.val());
            realInputD.val(inputD.val());
        } else {
            inputW.val(null);
            inputD.val(null);
            realInputW.val(status === true ? null : settings.fullDay);
            realInputD.val(status === true ? null : settings.fullDay);

            option
                .toggleClass('inactive')
                .toggleClass('active');

            inputW.add(inputD)
                .removeClass('active')
                .addClass('inactive');

            return;
        }
    };

    $.fn.WorkingDays = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.WorkingDays' );
        }

    };

})( jQuery );