/**
 * Created by Yarmaliuk Mikhail on 23.10.2017.
 *
 * @module MPWorkingDays
 */

/**
 * MPWorkingDays module
 *
 * @author Yarmaliuk Mikhail
 *
 * @param {MPWorkingDays||Object} app
 * @param {jQuery} $
 */
var MPWorkingDays = (function (app, $) {

    let settings = {};

    /**
     * Set input value
     *
     * @param {jQuery} option
     * @param {bool} toggle
     *
     * @return {undefined}
     */
    app.setInputValue = function (option, toggle) {
        let status = option.hasClass('active'),
            inputW = option.find('input.time-work'),
            inputD = option.find('input.time-dinner')
            realInputW = option.find('.realW')
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
        }
    };

    /**
     * Re Init module
     *
     * @return {undefined}
     */
    app.reInit = function () {

        let dayInputs = $('.time-work, .time-dinner');

        $.each(dayInputs, function (i, el) {
            let timeInput = $(el);

            // Remove inputmask
            timeInput.inputmask('remove');

            // Attach inputmask plugin
            timeInput.inputmask('09.19 - 09.19', {
                placeholder: "00.00 - 00.00",
                definitions: {
                    '0': {
                        validator: "[0-2]",
                        cardinality: 1
                    },
                    '1': {
                        validator: "[0-5]",
                        cardinality: 1
                    }
                }
            });

            // Attach keyup event
            timeInput
                .off('.MPWorkingDays')
                .on('keyup.MPWorkingDays', function (e) {
                    if ((e.keyCode >= 46 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 8 || e.keyCode === 13 || e.ctrlKey) {
                        app.setInputValue($(this).closest('.option'));
                    }
                });

            // Attach click event
            if (timeInput.hasClass('time-work')) {
                timeInput
                    .closest('div.option')
                    .off('.MPWorkingDays')
                    .on('click.MPWorkingDays', function (e) {
                        if (e.target.nodeName === 'DIV') {
                            app.setInputValue($(this), true);
                        }
                    });
            }
        });
    };

    /**
     * Init MPWorkingDays module
     *
     * @param {Object} options
     *
     * @return {undefined}
     */
    app.init = function (options) {

        settings = $.extend(settings, options);

        app.reInit();
    };

    return app;

}(MPWorkingDays || {}, jQuery));