<?php
/**
 * Created by PhpStorm.
 * User: Yarmaliuk Mikhail
 * Date: 20.10.2017
 * Time: 17:00
 */

namespace MP\WorkingDateTime;

use Yii;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\View;
use yii\widgets\InputWidget;

/**
 * Class    WorkingDays
 * @package MP\WorkingDateTime
 * @author  Yarmaliuk Mikhail
 * @version 1.0
 */
class WorkingDays extends InputWidget
{
    const ROUND_THE_CLOCK_1 = '00.00 - 00.00';
    const ROUND_THE_CLOCK_2 = '00.00 - 24.00';

    /**
     * Round-the-clock value
     *
     * @var string
     */
    public $roundTheClock;

    /**
     * Enable dinner input
     *
     * @var bool
     */
    public $enableDinner = true;

    /**
     * Automatic filling of time
     *
     * Example:
     * [1,2,5] // Automatic filling of time for 1,2,5 days
     * or
     * ['monday', 'friday']
     * !FILLS TIME FROM THE FILLED DAY!
     *
     * @var array
     */
    public $autocompleteDays = [];

    /**
     * @var string|array
     */
    public $value;

    /**
     * @inheritdoc
     * @return void
     */
    public function init()
    {
        if (empty($this->roundTheClock)) {
            $this->roundTheClock = self::ROUND_THE_CLOCK_2;
        }

        if (empty($this->options['id'])) {
            $this->options['id'] = $this->getId();
        }

        $this->value = $this->hasModel() ? Html::getAttributeValue($this->model, $this->attribute) : $this->value;

        if (is_string($this->value)) {
            $this->value = json_decode($this->value, true);
        }
    }

    /**
     * @inheritdoc
     * @return string
     */
    public function run()
    {
        $this->registerAssets();

        if ($this->hasModel()) {
            $inputName = Html::getInputName($this->model, $this->attribute);
        } else {
            $inputName = $this->name;
        }

        $days  = $this->getDays();
        $input = NULL;

        foreach ($days as $dayAlias => $dayTitle) {
            $day_status = empty($this->value[$dayAlias]['work']) && empty($this->value[$dayAlias]['dinner']) ? 'inactive' : 'active';

            $inputs = $this->getWorkingDayInput($inputName, $dayAlias)
                . ($this->enableDinner ? $this->getDinnerDayInput($inputName, $dayAlias) : NULL);

            $input .= Html::beginTag('div', ['class' => 'option ' . $day_status]);
            $input .= Html::beginTag('div', ['class' => 'option-row']);

            $input .= Html::tag('div', $dayTitle, ['class' => 'name', 'title' => Yii::t('app', 'Нажмите, чтобы активировать')]);
            $input .= Html::tag('div', $inputs, ['class' => 'value']);

            $input .= Html::endTag('div');
            $input .= Html::endTag('div');
        }

        if ($this->hasModel()) {
            $input .= Html::tag('span', NULL, ['id' => Html::getInputId($this->model, $this->attribute)]);
        }

        $input = Html::tag('div', $input, ['id' => $this->options['id'], 'class' => 'working-days']);

        return $input;
    }

    /**
     * Get week days
     *
     * @return array
     */
    public function getDays()
    {
        return [
            'monday'    => Yii::t('app', 'Понедельник'),
            'tuesday'   => Yii::t('app', 'Вторник'),
            'wednesday' => Yii::t('app', 'Среда'),
            'thursday'  => Yii::t('app', 'Четверг'),
            'friday'    => Yii::t('app', 'Пятница'),
            'saturday'  => Yii::t('app', 'Суббота'),
            'sunday'    => Yii::t('app', 'Воскресенье'),
        ];
    }

    /**
     * If empty time for days
     *
     * @param string $timeType work or dinner
     *
     * @return bool
     */
    private function isEmptyTimeDays($timeType)
    {
        if (is_array($this->value)) {
            foreach ($this->value as $day) {
                if (!empty($day[$timeType])) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get working day input
     *
     * @param $inputName
     * @param $dayAlias
     *
     * @return NULL|string
     */
    private function getWorkingDayInput($inputName, $dayAlias)
    {
        $days         = $this->getDays();
        $day_status   = empty($this->value[$dayAlias]['work']) && empty($this->value[$dayAlias]['dinner']) ? 'inactive' : 'active';
        $val1         = !empty($this->value[$dayAlias]['work']) && $this->value[$dayAlias]['work'] !== $this->roundTheClock ? $this->value[$dayAlias]['work'] : NULL;
        $val1Autofill = (!empty($this->autocompleteDays[$dayAlias]) || in_array(array_search($dayAlias, array_keys($days)) + 1, $this->autocompleteDays)) ? ($this->isEmptyTimeDays('dinner') ? 1 : -1) : 0;

        $input = NULL;

        // Masked input
        $input .= Html::textInput(NULL, $val1, [
            'class'            => 'form-control time-work ' . ($val1 ? 'active' : 'inactive'),
            'data-placeholder' => $day_status !== 'active' ? Yii::t('app', 'Раб.: круглосуточно') : Yii::t('app', 'Выходной'),
            'placeholder'      => $day_status === 'active' ? Yii::t('app', 'Раб.: круглосуточно') : Yii::t('app', 'Выходной'),
            'data-autofill'    => $val1Autofill,
        ]);

        // Real input
        $input .= Html::textInput($inputName . '[' . $dayAlias . '][work]', !empty($this->value[$dayAlias]['work']) ? $this->value[$dayAlias]['work'] : NULL, ['class' => 'hide realW']);

        return $input;
    }

    /**
     * Get dinner day input
     *
     * @param $inputName
     * @param $dayAlias
     *
     * @return NULL|string
     */
    private function getDinnerDayInput($inputName, $dayAlias)
    {
        $days         = $this->getDays();
        $day_status   = empty($this->value[$dayAlias]['work']) && empty($this->value[$dayAlias]['dinner']) ? 'inactive' : 'active';
        $val2         = !empty($this->value[$dayAlias]['dinner']) && $this->value[$dayAlias]['dinner'] !== $this->roundTheClock ? $this->value[$dayAlias]['dinner'] : NULL;
        $val2Autofill = (!empty($this->autocompleteDays[$dayAlias]) || in_array(array_search($dayAlias, array_keys($days)) + 1, $this->autocompleteDays)) ? ($this->isEmptyTimeDays('dinner') ? 1 : -1) : 0;

        $input = NULL;

        // Masked input
        $input .= Html::textInput($inputName . '[' . $dayAlias . '][dinner]', $val2, [
            'class'            => 'form-control time-dinner ' . ($val2 ? 'active' : 'inactive'),
            'data-placeholder' => $day_status !== 'active' ? Yii::t('app', 'Обед: без обеда') : Yii::t('app', 'Выходной'),
            'placeholder'      => $day_status === 'active' ? Yii::t('app', 'Обед: без обеда') : Yii::t('app', 'Выходной'),
            'data-autofill'    => $val2Autofill,
        ]);

        // Real input
        $input .= Html::textInput($inputName . '[' . $dayAlias . '][dinner]', !empty($this->value[$dayAlias]['dinner']) ? $this->value[$dayAlias]['dinner'] : NULL, ['class' => 'hide realD']);

        return $input;
    }

    /**
     * Register widget assets
     *
     * @return void
     */
    private function registerAssets()
    {
        WorkingDaysAsset::register($this->view);

        $options = [
            'fullDay'       => $this->roundTheClock,
            'enableDinner'  => $this->enableDinner,
            'roundTheClock' => $this->roundTheClock,
        ];

        $this->view->registerJs("MPWorkingDays.addInputSettings('{$this->options['id']}', " . Json::encode($options) . ")");
        $this->view->registerJs("MPWorkingDays.init(" . Json::encode($options) . ");", View::POS_READY, 'MPWorkingDays');
    }
}