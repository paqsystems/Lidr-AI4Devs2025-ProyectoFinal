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
        Schema::table('PQ_PARTES_cliente', function (Blueprint $table) {
            $table->unsignedBigInteger('tipo_cliente_id')->after('nombre')->comment('FK a PQ_PARTES_tipo_cliente (obligatorio)');
            
            // Foreign key
            $table->foreign('tipo_cliente_id')
                  ->references('id')
                  ->on('PQ_PARTES_tipo_cliente')
                  ->onDelete('restrict'); // No se puede eliminar un tipo de cliente si hay clientes asociados
            
            // Índice
            $table->index('tipo_cliente_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('PQ_PARTES_cliente', function (Blueprint $table) {
            $table->dropForeign(['tipo_cliente_id']);
            $table->dropIndex(['tipo_cliente_id']);
            $table->dropColumn('tipo_cliente_id');
        });
    }
};

