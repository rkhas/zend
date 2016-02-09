<?php

/**
 * This is the model class for table "News".
 *
 * @property integer $id_news
 * @property string $header
 * @property string $anons
 * @property string $context
 * @property integer $add_date
 * @property integer $up_date
 * @property boolean $posted
 */

class Application_Model_DbTable_News extends Zend_Db_Table_Abstract {

    protected $_name = 'news';

    protected $id_news;
    protected $header;
    protected $anons;
    protected $context;
    protected $add_date;
    protected $up_date;
    protected $posted = false;

    public function getNews($id_news) {
        $id_news = (int) $id_news;
        $row = $this->fetchRow('id_news = ' . $id_news);
        if (!$row) {
            throw new Exception("Count not find row $id_news");
        }
        return $row->toArray();
    }

    public function addNews($header, $anons, $context, $date_add, $posted = FALSE) {
        $data = array(
            'header' => $header,
            'anons' => $anons,
            'context' => $context,
            'add_date' => $date_add,
            'posted' => $posted,
        );
        $this->insert($data);
    }

    public function updateNews($id_news, $header, $anons, $context, $up_date, $posted = FALSE) {
        $data = array(
            'header' => $header,
            'anons' => $anons,
            'context' => $context,
            'up_date' => $up_date,
            'posted' => $posted,
        );
        $this->update($data, 'id_news = ' . (int) $id_news);
    }

    public function deleteNews($id_news) {
        $this->delete('id_news =' . (int) $id_news);
    }

}
