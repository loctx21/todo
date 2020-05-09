<?php

namespace Tests\Feature;

use App\Item;
use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class TodoUnauthorizeApiTest extends TestCase
{
    public function testUnauthenticatedCreate()
    {
        $response = $this->post("/api/item");
        
        $response->assertStatus(302);
        $response->assertRedirect('login');
    }

    public function testUnauthorizeUpdate()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);

        $user1 = factory(User::class)->create();
        $item = factory(Item::class)->create([
            'user_id' => $user1->id
        ]);

        $response = $this->put("/api/item/{$item->id}");
        
        $response->assertStatus(403);
    }

    public function testUnauthorizeGet()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);

        $user1 = factory(User::class)->create();
        $item = factory(Item::class)->create([
            'user_id' => $user1->id
        ]);

        $response = $this->get("/api/item/{$item->id}");
        
        $response->assertStatus(403);
    }

    public function testUnauthorizeDelete()
    {
        $user = factory(User::class)->create();
        Passport::actingAs($user, ['*']);

        $user1 = factory(User::class)->create();
        $item = factory(Item::class)->create([
            'user_id' => $user1->id
        ]);

        $response = $this->delete("/api/item/{$item->id}");
        
        $response->assertStatus(403);
    }
}
