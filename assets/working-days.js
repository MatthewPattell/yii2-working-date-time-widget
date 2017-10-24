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

    /**
     * Add personal input settings
     *
     * @param {string} id
     * @param {Object} settings
     *
     * @return {undefined}
     */
    app.addInputSettings = function (id, settings) {
        $('#' + id).data('MPWorkingDaysSettings', settings);
    };

    /**
     * Get input setting
     *
     * @param {jQuery} element
     * @param {string} settingName
     *
     * @return {null|string|bool}
     */
    let getInputSetting = function (element, settingName) {
        return element.data('MPWorkingDaysSettings')[settingName] !== undefined ? element.data('MPWorkingDaysSettings')[settingName] : null;
    };

    /**
     * Set input value
     *
     * @param {jQuery} option
     * @param {bool} toggle
     *
     * @return {undefined}
     */
    app.setInputValue = function (option, toggle) {
        let widget = option.closest('.working-days')
            status = option.hasClass('active');

        let fullDay = getInputSetting(widget, 'fullDays'),
            enableDinner = getInputSetting(widget, 'enableDinner');

        let inputW = option.find('input.time-work'),
            realInputW = option.find('.realW');

        let inputD = enableDinner ? option.find('input.time-dinner') : null,
            realInputD = enableDinner ? option.find('.realD') : null;

        if (toggle !== true) {
            if (!inputW.val().length && (!inputD || !inputD.val().length)) {
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

                if (enableDinner) {
                    inputD
                        .removeClass(!inputD.val().length ? 'active' : 'inactive')
                        .addClass(inputD.val().length ? 'active' : 'inactive');
                }
            }

            realInputW.val(inputW.val());

            if (enableDinner) {
                realInputD.val(inputD.val());
            }
        } else {
            inputW.val(null);
            realInputW.val(status === true ? null : fullDay);

            if (enableDinner) {
                inputD.val(null);
                realInputD.val(status === true ? null : fullDay);
            }

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
        app.reInit();
    };

    return app;

}(MPWorkingDays || {}, jQuery));