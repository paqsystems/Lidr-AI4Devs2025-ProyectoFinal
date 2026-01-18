<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo: Cliente
 * 
 * Representa los clientes para los cuales se registran tareas.
 */
class Cliente extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'PQ_PARTES_cliente';

    /**
     * Campos que pueden ser asignados masivamente
     */
    protected $fillable = [
        'nombre',
        'tipo_cliente_id',
        'activo',
    ];

    /**
     * Casts de tipos de datos
     */
    protected $casts = [
        'tipo_cliente_id' => 'integer',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Valores por defecto
     */
    protected $attributes = [
        'activo' => true,
    ];

    /**
     * Relación: Un Cliente tiene muchos RegistroTarea
     */
    public function registrosTarea(): HasMany
    {
        return $this->hasMany(RegistroTarea::class, 'cliente_id');
    }

    /**
     * Relación: Un Cliente pertenece a un TipoCliente
     */
    public function tipoCliente(): BelongsTo
    {
        return $this->belongsTo(TipoCliente::class, 'tipo_cliente_id');
    }

    /**
     * Relación: Un Cliente tiene muchos TipoTarea (a través de ClienteTipoTarea)
     */
    public function tiposTarea(): BelongsToMany
    {
        return $this->belongsToMany(
            TipoTarea::class,
            'PQ_PARTES_cliente_tipo_tarea',
            'cliente_id',
            'tipo_tarea_id'
        )->withTimestamps();
    }
}

