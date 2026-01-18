<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modelo: TipoTarea
 * 
 * Representa los tipos de tareas que se pueden registrar en el sistema.
 * 
 * Campos booleanos:
 * - is_generico: Indica si el tipo de tarea es genérico (disponible para todos los clientes)
 * - is_default: Indica si este tipo de tarea es el predeterminado del sistema
 * 
 * NOTA: Las reglas de negocio asociadas se implementarán en una fase posterior:
 * - TODO: Solo un TipoTarea puede tener is_default = true en todo el sistema
 * - TODO: Regla de visibilidad al crear tarea (mostrar genéricos + asociados al cliente) SI
 */
class TipoTarea extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'PQ_PARTES_tipo_tarea';

    /**
     * Campos que pueden ser asignados masivamente
     */
    protected $fillable = [
        'descripcion',
        'is_generico',
        'is_default',
        'activo',
    ];

    /**
     * Casts de tipos de datos
     */
    protected $casts = [
        'is_generico' => 'boolean',
        'is_default' => 'boolean',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Valores por defecto
     */
    protected $attributes = [
        'is_generico' => false,
        'is_default' => false,
        'activo' => true,
    ];

    /**
     * Relación: Un TipoTarea tiene muchos RegistroTarea
     */
    public function registrosTarea(): HasMany
    {
        return $this->hasMany(RegistroTarea::class, 'tipo_tarea_id');
    }

    /**
     * Relación: Un TipoTarea pertenece a muchos Clientes (a través de ClienteTipoTarea)
     */
    public function clientes(): BelongsToMany
    {
        return $this->belongsToMany(
            Cliente::class,
            'PQ_PARTES_cliente_tipo_tarea',
            'tipo_tarea_id',
            'cliente_id'
        )->withTimestamps();
    }
}

