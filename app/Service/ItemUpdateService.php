<?php

namespace App\Service;

use App\Item;
use App\User;
use Carbon\Carbon;

class ItemUpdateService {

    /**
     * Update item from request data
     * 
     * @param array $data
     * 
     * @return \App\Item
     */
    public function update($item, $data)
    {
        $item->fill($data);

        if (array_key_exists('due_at', $data))
            $item->due_at =  (new Carbon($data['due_at']))->toDateTimeString();
        if (array_key_exists('status', $data)) {
            $history = null;

            if ($data['status'] && !$item->done_at) {
                $item->done_at = Carbon::now()->toDateTimeString(); 
                $history = "Mark done at {$item->done_at}";
            }
            else if (!$data['status'] && $item->done_at) {
                $item->done_at = NULL; 
                $history = "Mark undone at " . Carbon::now()->toDateTimeString();
            }

            if ($history)
                $item->history = is_array($item->history) ? array_merge($item->history, [$history]) 
                    : [$history]; 
        }

        $item->save();

        return $item;
    }
}