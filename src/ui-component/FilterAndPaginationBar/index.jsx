// src/ui-component/FilterAndPaginationBar/index.jsx
import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const FilterAndPaginationBar = ({
                                    filterConfig,
                                    onApplyFilters,
                                    applyButtonText = 'Aplicar', // Texto padrão
                                    applyButtonLoading = false,
                                    currentPage,
                                    onPageChange,
                                    itemsPerPage,
                                    onItemsPerPageChange,
                                    totalItems,
                                    itemsPerPageOptions,
                                    paginationLoading = false,
                                    sx, // Para estilos adicionais no contêiner principal
                                    additionalRightContent // Para qualquer conteúdo extra à direita
                                }) => {
    const theme = useTheme();

    const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1, // ZIndex menor pois está dentro de um MainCard com zIndex
                flexShrink: 0,
                backgroundColor: theme.palette.background.default,
                padding: theme.spacing(2),
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                ...sx // Permite sobrescrever estilos via props
            }}
        >
            {/* Container principal com flexbox para alinhar à direita */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'space-between' }, // Centraliza em xs, space-between em md+
                flexWrap: { xs: 'wrap', md: 'nowrap' }, // Quebra linha em xs, não quebra em md+
                gap: theme.spacing(2) // Espaçamento entre os dois grandes blocos
            }}>
                {/* Bloco dos Filtros e Botão (lado esquerdo) */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2), // Espaçamento entre os itens de filtro
                    flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' }, // Responsividade interna dos filtros
                    flexShrink: 0 // Não permite que este bloco encolha
                }}>
                    {filterConfig.map((filter, index) => (
                        <React.Fragment key={filter.name}>
                            {filter.type === 'text' && (
                                <TextField
                                    label={filter.label}
                                    value={filter.value}
                                    onChange={filter.onChange}
                                    {...filter.props} // Passa props adicionais (minWidth, size)
                                />
                            )}
                            {filter.type === 'select' && (
                                <TextField
                                    select
                                    label={filter.label}
                                    value={filter.value}
                                    onChange={filter.onChange}
                                    {...filter.props} // Passa props adicionais (minWidth, size)
                                >
                                    {filter.options && filter.options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </React.Fragment>
                    ))}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onApplyFilters}
                        disabled={applyButtonLoading}
                        size="small"
                    >
                        {applyButtonText}
                    </Button>
                </Box>

                {/* Bloco dos Controles de Paginação e Conteúdo Adicional (lado direito) */}
                {(totalItems > 0 || additionalRightContent) && ( // Só mostra se há itens ou conteúdo adicional
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(1), // Espaçamento entre itens de paginação
                        flexWrap: 'nowrap', // Não quebra linha interna
                        flexShrink: 0 // Não permite que este bloco encolha
                    }}>
                        {totalItems > 0 && ( // Mostra a paginação apenas se houver logs
                            <>
                                <TextField
                                    select
                                    label="Por página"
                                    value={itemsPerPage}
                                    onChange={onItemsPerPageChange}
                                    sx={{ minWidth: 100 }}
                                    size="small"
                                    disabled={paginationLoading}
                                >
                                    {itemsPerPageOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                    {totalItems} registros
                                </Typography>

                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={onPageChange}
                                    color="primary"
                                    disabled={paginationLoading}
                                    size="small"
                                />
                            </>
                        )}
                        {additionalRightContent} {/* Slot para conteúdo extra */}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

// PropTypes para validação e documentação
FilterAndPaginationBar.propTypes = {
    filterConfig: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'select']).isRequired,
        value: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
        })),
        props: PropTypes.object, // Para passar props adicionais ao TextField
    })).isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    applyButtonText: PropTypes.string,
    applyButtonLoading: PropTypes.bool,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    onItemsPerPageChange: PropTypes.func.isRequired,
    totalItems: PropTypes.number.isRequired,
    itemsPerPageOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    paginationLoading: PropTypes.bool,
    sx: PropTypes.object,
    additionalRightContent: PropTypes.node,
};

export default FilterAndPaginationBar;