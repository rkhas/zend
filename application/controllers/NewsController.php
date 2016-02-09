<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of News
 *
 * @author bandit
 */
class NewsController extends Zend_Controller_Action {

    public function indexAction() {
        $this->view->title = "Список новостей";
        $this->view->headTitle($this->view->title);
    }
    
    public function listAction() {
        $news = new Application_Model_DbTable_News();
        $newsArr = $news->fetchAll()->toArray();
        $data = array(); $count = 0;
        foreach ($newsArr as $n) {
            $data[] = array(
                'id_news' => $n['id_news'],
                'header' => $n['header'], 
                'anons' => $n['anons'], 
                'add_date' => $n['add_date'], 
                'context' => $n['context'],
                'posted' => $n['posted'] ? true : false
            );
            $count++;
        }
        
        $data = array(
            'results' => $count,
            'rows' => $data
        );
        
        echo Zend_Json::encode($data); die();
    }

    public function addAction() {
        $formData = $this->getRequest()->getPost();
        if ($formData) {
            $form = new Application_Form_News();
            if ($form->isValid($formData)) {
                $header = $form->getValue('header');
                $anons = $form->getValue('anons');
                $context = $form->getValue('context');
                $add_date = strtotime("now");
                $posted = $form->$formData['posted'];
                
                $news = new Application_Model_DbTable_News();
                $news->addNews($header, $anons, $context, $add_date, $posted);
                
                echo Zend_Json::encode(['succ'=>true, "data" => [$header, $anons, $context, $add_date, $posted]]); die();
            } else {
                echo Zend_Json::encode(['succ'=>false, 'desc' => "Неверно заполнены поля"]); die("no valid");
            }
        } else {
            echo Zend_Json::encode(['succ'=>false, 'desc' => "Неизвестная ошибка"]); die("no form");
        }
    }
    
    public function deleteAction() {
        $result = array("succ" => false, "desc" => "Неизвестная ошибка");
        $formData = $this->getRequest()->getPost();
        if ($formData) {
            $newsObj = new Application_Model_DbTable_News();
            $news = $newsObj->fetchRow('id_news = ' . $formData['id_news']);//->toArray();
            if ($news) {
                $news->delete();
                $result['succ'] = true;
            } else {
                $result['desc'] = "Данной новости не существует";
            }
        } else {/*TODO: error*/}
        
        $result['succ'] = true;
        echo Zend_Json::encode($result); die();
    }
    
    public function updateAction() {
        $result = array("succ" => false, "desc" => "Неизвестная ошибка");
        $formData = $this->getRequest()->getPost();
        // если поступили данные
        if ($formData) {
            $newsObj = new Application_Model_DbTable_News();
            $news = $newsObj->fetchRow('id_news = ' . $formData['id_news']);//->toArray();
            // если такая новость
            if ($news) {
                $form = new Application_Form_News();
                // если все валидно
                if ($form->isValid($formData)) {
                    $news->header = $form->getValue('header');
                    $news->anons = $form->getValue('anons');
                    $news->context = $form->getValue('context');
                    $news->up_date = strtotime("now");
                    $news->posted = $formData['posted'];
                    
                    $news->save(); // save

                    echo json_encode(['succ'=>true, "data" => [$news->header, $news->anons, $news->context, $news->add_date, $news->posted]]); die();
                } else {
                    echo json_encode(['succ'=>false, 'desc' => "Неверно заполнены поля"]); die("no valid");
                }
            } else {
                $result['desc'] = "Данной новости не существует";
            }
        } else {/*TODO: error*/}
        
        $result['succ'] = true;
        echo Zend_Json::encode($result); die();
    }
}
