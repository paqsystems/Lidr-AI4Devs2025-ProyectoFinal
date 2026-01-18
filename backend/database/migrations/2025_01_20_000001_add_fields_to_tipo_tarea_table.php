<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración: Agregar campos is_generico e is_default a PQ_PARTES_tipo_tarea
 * 
 * Esta migración agrega dos campos booleanos a la tabla de tipos de tarea:
 * - is_generico: Indica si el tipo de tarea es genérico (disponible para todos los clientes)
 * - is_default: Indica si este tipo de tarea es el predeterminado del sistema
 * 
 * NOTA: Las reglas de negocio asociadas (un solo is_default=true, visibilidad por cliente)
 * se implementarán en una fase posterior.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('PQ_PARTES_tipo_tarea', function (Blueprint $table) {
            $table->boolean('is_generico')->default(false)->after('descripcion');
            $table->boolean('is_default')->default(false)->after('is_generico');
            
            // Índice para búsquedas de tipos genéricos
            $table->index('is_generico', 'idx_tipo_tarea_generico');
            
            // Índice para búsquedas del tipo predeterminado
            $table->index('is_default', 'idx_tipo_tarea_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('PQ_PARTES_tipo_tarea', function (Blueprint $table) {
            $table->dropIndex('idx_tipo_tarea_default');
            $table->dropIndex('idx_tipo_tarea_generico');
            $table->dropColumn(['is_default', 'is_generico']);
        });
    }
};

