<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->renameColumn('user_id', 'owner_id');
        });

        Schema::table('shops', function (Blueprint $table) {
            $table->foreignId('owner_id')->nullable()->change();
            $table->foreign('owner_id')->references('id')->on('users')->nullOnDelete();
            $table->unique('owner_id');

            $table->text('description')->nullable()->after('slug');
            $table->string('banner')->nullable()->after('logo');
            $table->string('email')->nullable()->after('banner');
            $table->string('phone', 30)->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->string('city', 100)->nullable()->after('address');
            $table->string('country', 100)->nullable()->after('city');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['description', 'banner', 'email', 'phone', 'address', 'city', 'country']);
            $table->dropForeign(['owner_id']);
            $table->dropUnique(['owner_id']);
            $table->renameColumn('owner_id', 'user_id');
        });

        Schema::table('shops', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
