<?php

namespace Tests\Feature;

use App\Item;
use App\User;
use Carbon\Carbon;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class TodoApiAuthorizeTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCreateRequired()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);

        $data = [
            'name' => 'Item 1'
        ];

        $response = $this->json('POST', '/api/item', $data);

        $response->assertStatus(200);
        $res = array_merge($data, [
            'user_id' => $user->id,
            'due_at' => null,
            'done_at' => null,
            'history' => null,
            'description' => null
        ]);
        $response->assertJsonFragment($res);
    }

    public function testCreateNoneRequired()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);

        $data = [
            'name' => 'Item 1',
            'description' => 'Description 1',
            'due_at' => '2020-05-08T10:00:00Z',
            'done_at' => '2020-05-08T10:00:00Z',
            'status'  => true
        ];

        $response = $this->json('POST', '/api/item', $data);

        $response->assertStatus(200);
        $res = [
            'user_id' => $user->id,
            'due_at' => '2020-05-08 10:00:00',
            'done_at' => null,
            'history' => null
        ];
        $response->assertJsonFragment($res);
        $response->assertJsonMissing(['status' => true]);
    }

    public function testUpdateStatusOnly()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);
        $item = factory(Item::class)->create([
            'user_id' => $user->id
        ]);

        $data = [
            'status' => true
        ];

        $response = $this->json('PUT', "/api/item/{$item->id}", $data);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'done_at' => Carbon::now()->toDateTimeString(),
            'history' => [
                "Mark done at " . Carbon::now()->toDateTimeString()
            ]
        ]);
    }

    public function testUpdateNoneStatus()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);
        $item = factory(Item::class)->create([
            'user_id' => $user->id
        ]);

        $data = [
            'name' => "New name",
            'description' => "New description",
            'due_at' => '2020-05-08 10:00:00'
        ];

        $response = $this->json('PUT', "/api/item/{$item->id}", $data);

        $response->assertStatus(200);
        $res = array_merge($data, [
            'due_at' => '2020-05-08 10:00:00'
        ]);
        $response->assertJsonFragment($res);
    }

    public function testGetItem()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);
        $item = factory(Item::class)->create([
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', "/api/item/{$item->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $item->id]);
    }

    public function testGetItems()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);
        $res = [];
        for ($i = 0; $i < 5; $i++) {
            $item = factory(Item::class)->create([
                'user_id' => $user->id
            ]);
            $res[] = $item;
        }

        $response = $this->json('GET', "/api/item");

        $response->assertStatus(200);
        $response->assertJsonCount(5);
        foreach ($res as $item)
            $response->assertJsonFragment(['id' => $item->id]);
    }

    public function testDeleteItem()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);
        $item = factory(Item::class)->create([
            'user_id' => $user->id
        ]);

        $response = $this->json('DELETE', "/api/item/{$item->id}");

        $response->assertStatus(200);
        $response->assertSee('true');
        $this->assertDatabaseMissing('items', $item->toArray());
    }
}
