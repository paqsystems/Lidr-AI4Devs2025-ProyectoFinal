<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo: RegistroTarea
 * 
 * Representa el registro de una tarea realizada por un usuario para un cliente.
 * 
 * Campos importantes:
 * - fecha: Fecha en que se realizó la tarea
 * - duracion_minutos: Duración en minutos (debe ser múltiplo de 15)
 * - sin_cargo: Indica si la tarea es sin cargo para el cliente
 * - presencial: Indica si la tarea es presencial (en el cliente)
 * - observacion: Descripción de la tarea (obligatorio)
 * - cerrado: Indica si la tarea está cerrada (no se puede modificar ni eliminar)
 * 
 * Reglas de negocio:
 * - duracion_minutos debe ser múltiplo de 15 (tramos de 15 minutos)
 * - duracion_minutos debe ser > 0 y <= 1440 (máximo 24 horas)
 * - fecha no puede ser futura (advertencia, no bloquea)
 * - observacion es obligatorio (no puede estar vacío)
 * - Una tarea cerrada (cerrado = true) no se puede modificar ni eliminar
 */
class RegistroTarea extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla
     */
    protected $table = 'PQ_PARTES_registro_tarea';

    /**
     * Campos que pueden ser asignados masivamente
     */
    protected $fillable = [
        'usuario_id',
        'cliente_id',
        'tipo_tarea_id',
        'fecha',
        'duracion_minutos',
        'sin_cargo',
        'presencial',
        'observacion',
        'cerrado',
    ];

    /**
     * Casts de tipos de datos
     */
    protected $casts = [
        'usuario_id' => 'integer',
        'cliente_id' => 'integer',
        'tipo_tarea_id' => 'integer',
        'fecha' => 'date',
        'duracion_minutos' => 'integer',
        'sin_cargo' => 'boolean',
        'presencial' => 'boolean',
        'cerrado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Valores por defecto
     */
    protected $attributes = [
        'sin_cargo' => false,
        'presencial' => false,
        'cerrado' => false,
    ];

    /**
     * Relación: Un RegistroTarea pertenece a un Usuario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /**
     * Relación: Un RegistroTarea pertenece a un Cliente
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Relación: Un RegistroTarea pertenece a un TipoTarea
     */
    public function tipoTarea(): BelongsTo
    {
        return $this->belongsTo(TipoTarea::class, 'tipo_tarea_id');
    }

    /**
     * Verificar si la tarea está cerrada
     * 
     * @return bool
     */
    public function isCerrada(): bool
    {
        return $this->cerrado === true;
    }

    /**
     * Obtener duración en horas (decimal)
     * 
     * @return float
     */
    public function getDuracionHorasAttribute(): float
    {
        return round($this->duracion_minutos / 60, 2);
    }

    /**
     * Scope para tareas abiertas (no cerradas)
     */
    public function scopeAbiertas($query)
    {
        return $query->where('cerrado', false);
    }

    /**
     * Scope para tareas cerradas
     */
    public function scopeCerradas($query)
    {
        return $query->where('cerrado', true);
    }

    /**
     * Scope para tareas de un usuario específico
     */
    public function scopeDelUsuario($query, int $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Scope para tareas de un cliente específico
     */
    public function scopeDelCliente($query, int $clienteId)
    {
        return $query->where('cliente_id', $clienteId);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopeEnRangoFechas($query, ?string $fechaDesde, ?string $fechaHasta)
    {
        if ($fechaDesde) {
            $query->where('fecha', '>=', $fechaDesde);
        }
        
        if ($fechaHasta) {
            $query->where('fecha', '<=', $fechaHasta);
        }
        
        return $query;
    }
}

