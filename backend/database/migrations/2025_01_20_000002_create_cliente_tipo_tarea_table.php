<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración: Crear tabla PQ_PARTES_cliente_tipo_tarea
 * 
 * Esta migración crea la tabla de asociación entre Cliente y TipoTarea.
 * Permite asignar tipos de tarea específicos (no genéricos) a clientes.
 * 
 * NOTA: La regla de negocio de visibilidad (mostrar genéricos + asociados al cliente)
 * se implementará en una fase posterior.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('PQ_PARTES_cliente_tipo_tarea', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('tipo_tarea_id');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('cliente_id', 'fk_cliente_tipo_tarea_cliente')
                  ->references('id')
                  ->on('PQ_PARTES_cliente')
                  ->onDelete('cascade');
                  
            $table->foreign('tipo_tarea_id', 'fk_cliente_tipo_tarea_tipo')
                  ->references('id')
                  ->on('PQ_PARTES_tipo_tarea')
                  ->onDelete('cascade');
            
            // Unique constraint: un cliente no puede tener el mismo tipo de tarea asignado dos veces
            $table->unique(['cliente_id', 'tipo_tarea_id'], 'uk_cliente_tipo_tarea');
            
            // Índices para búsquedas
            $table->index('cliente_id', 'idx_cliente_tipo_tarea_cliente');
            $table->index('tipo_tarea_id', 'idx_cliente_tipo_tarea_tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('PQ_PARTES_cliente_tipo_tarea');
    }
};

