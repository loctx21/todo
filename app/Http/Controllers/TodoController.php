<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateItem;
use App\Http\Requests\UpdateItem;
use App\Item;
use Illuminate\Http\Request;
use App\Service\ItemCreateService;
use App\Service\ItemUpdateService;

class TodoController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index() 
    {
        return view('todo.index');
    }

    public function item(Item $item) 
    {
        $this->authorize('view', $item);

        return view('todo.index');
    }

    public function getItem(Item $item)
    {
        $this->authorize('view', $item);

        return response()->json($item);
    }

    public function create(CreateItem $request)
    {
        $service = new ItemCreateService($request);
        return response()->json($service->create($request->validated()));
    }

    public function update(Item $item, UpdateItem $request)
    {
        $this->authorize('update', $item);

        $service = new ItemUpdateService($request->all(), $item);
        return response()->json($service->update($item, $request->validated()));
    }

    public function get(Request $request)
    {
        return response()->json(
            $request->user()->items
        );
    }

    public function delete(Item $item, Request $request)
    {
        $this->authorize('forceDelete', $item);

        return response()->json(
            $item->delete()
        );
    }
}
