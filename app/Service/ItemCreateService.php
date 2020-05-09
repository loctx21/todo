<?php

namespace App\Service;

use App\Item;
use App\User;
use Carbon\Carbon;

class ItemCreateService {


    /**
     * Create item from request data
     * 
     * @param array $data
     * 
     * @return \App\Item
     */
    public function create($data)
    {
        $item = new Item;
        
        $item->fill($data);
        if (array_key_exists('due_at', $data))
            $item->due_at =  (new Carbon($data['due_at']))->toDateTimeString();
        $item->user_id = auth()->user()->id;
        $item->save();
        $item = $item->fresh();

        return $item;
    }
}