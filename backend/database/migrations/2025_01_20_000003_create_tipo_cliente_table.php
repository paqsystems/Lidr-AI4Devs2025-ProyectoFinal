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
        Schema::create('PQ_PARTES_tipo_cliente', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion', 100)->comment('Descripción del tipo de cliente');
            $table->boolean('activo')->default(true)->comment('Indica si el tipo de cliente está activo');
            $table->timestamps();

            // Índices
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('PQ_PARTES_tipo_cliente');
    }
};

