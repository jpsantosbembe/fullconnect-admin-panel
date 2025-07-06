// Componente para a barra de ferramentas do editor
const EditorMenuBar = ({ editor }) => {
    const theme = useTheme();

    if (!editor) {
        return null;
    }

    const buttonStyle = {
        padding: '6px',
        minWidth: 'unset',
        borderRadius: '4px',
        margin: '0 2px'
    };

    const activeButtonStyle = {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                padding: '8px',
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                marginBottom: '8px'
            }}
        >
            <Box sx={{ display: 'flex', marginRight: 1, marginBottom: 1 }}>
                <Tooltip title="Negrito">
                    <ToggleButton
                        value="bold"
                        selected={editor.isActive('bold')}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        sx={{ ...buttonStyle, ...(editor.isActive('bold') ? activeButtonStyle : {}) }}
                    >
                        <FormatBoldIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Itálico">
                    <ToggleButton
                        value="italic"
                        selected={editor.isActive('italic')}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        sx={{ ...buttonStyle, ...(editor.isActive('italic') ? activeButtonStyle : {}) }}
                    >
                        <FormatItalicIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Sublinhado">
                    <ToggleButton
                        value="underline"
                        selected={editor.isActive('underline')}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        sx={{ ...buttonStyle, ...(editor.isActive('underline') ? activeButtonStyle : {}) }}
                    >
                        <FormatUnderlinedIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

            <Box sx={{ display: 'flex', marginRight: 1, marginBottom: 1 }}>
                <Tooltip title="Lista com marcadores">
                    <ToggleButton
                        value="bulletList"
                        selected={editor.isActive('bulletList')}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        sx={{ ...buttonStyle, ...(editor.isActive('bulletList') ? activeButtonStyle : {}) }}
                    >
                        <FormatListBulletedIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Lista numerada">
                    <ToggleButton
                        value="orderedList"
                        selected={editor.isActive('orderedList')}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        sx={{ ...buttonStyle, ...(editor.isActive('orderedList') ? activeButtonStyle : {}) }}
                    >
                        <FormatListNumberedIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

            <Box sx={{ display: 'flex', marginRight: 1, marginBottom: 1 }}>
                <Tooltip title="Alinhar à esquerda">
                    <ToggleButton
                        value="left"
                        selected={editor.isActive({ textAlign: 'left' })}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        sx={{ ...buttonStyle, ...(editor.isActive({ textAlign: 'left' }) ? activeButtonStyle : {}) }}
                    >
                        <FormatAlignLeftIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Centralizar">
                    <ToggleButton
                        value="center"
                        selected={editor.isActive({ textAlign: 'center' })}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        sx={{ ...buttonStyle, ...(editor.isActive({ textAlign: 'center' }) ? activeButtonStyle : {}) }}
                    >
                        <FormatAlignCenterIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Alinhar à direita">
                    <ToggleButton
                        value="right"
                        selected={editor.isActive({ textAlign: 'right' })}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        sx={{ ...buttonStyle, ...(editor.isActive({ textAlign: 'right' }) ? activeButtonStyle : {}) }}
                    >
                        <FormatAlignRightIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

            <Box sx={{ display: 'flex', marginRight: 1, marginBottom: 1 }}>
                <Tooltip title="Link">
                    <ToggleButton
                        value="link"
                        selected={editor.isActive('link')}
                        onClick={() => {
                            const url = window.prompt('URL:');
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            } else if (editor.isActive('link')) {
                                editor.chain().focus().unsetLink().run();
                            }
                        }}
                        sx={{ ...buttonStyle, ...(editor.isActive('link') ? activeButtonStyle : {}) }}
                    >
                        <LinkIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Adicionar Imagem">
                    <ToggleButton
                        value="image"
                        onClick={() => {
                            const url = window.prompt('URL da imagem:');
                            if (url) {
                                editor.chain().focus().setImage({ src: url }).run();
                            }
                        }}
                        sx={buttonStyle}
                    >
                        <ImageIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

            <Box sx={{ display: 'flex', marginRight: 1, marginBottom: 1 }}>
                <Tooltip title="Código HTML">
                    <ToggleButton
                        value="html"
                        selected={editor.isActive('codeBlock')}
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        sx={{ ...buttonStyle, ...(editor.isActive('codeBlock') ? activeButtonStyle : {}) }}
                    >
                        <CodeIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Adicionar Variável">
                    <ToggleButton
                        value="variable"
                        onClick={() => {
                            const varName = window.prompt('Nome da variável:');
                            if (varName) {
                                editor.chain().focus().insertContent(`{{${varName}}}`).run();
                            }
                        }}
                        sx={buttonStyle}
                    >
                        <AddIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

            <Box sx={{ display: 'flex', marginRight: 1, marginBottom: 1 }}>
                <Tooltip title="Desfazer">
                    <ToggleButton
                        value="undo"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        sx={buttonStyle}
                    >
                        <UndoIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Refazer">
                    <ToggleButton
                        value="redo"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        sx={buttonStyle}
                    >
                        <RedoIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </Box>
        </Box>
    );
};import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// tiptap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Snackbar,
    ToggleButtonGroup,
    ToggleButton,
    Tooltip
} from '@mui/material';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import CodeIcon from '@mui/icons-material/Code';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import emailService from '../../../services/emailService';

const EmailEditPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    // Estados para os dados do template
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [subject, setSubject] = useState('');
    const [bodyHtml, setBodyHtml] = useState('');
    const [status, setStatus] = useState('DRAFT');

    // Estados para controle da UI
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [validation, setValidation] = useState({
        name: '',
        slug: '',
        subject: '',
        bodyHtml: ''
    });

    // Inicializar o editor TipTap
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image,
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: 'Digite o conteúdo do seu email aqui...',
            }),
        ],
        content: bodyHtml,
        onUpdate: ({ editor }) => {
            setBodyHtml(editor.getHTML());
        },
    });

    // Atualizar o conteúdo do editor quando bodyHtml mudar externamente
    useEffect(() => {
        if (editor && bodyHtml !== editor.getHTML()) {
            editor.commands.setContent(bodyHtml);
        }
    }, [editor, bodyHtml]);

    // Carregar dados do template
    useEffect(() => {
        const fetchTemplateData = async () => {
            setIsLoading(true);
            try {
                if (id && id !== 'new') {
                    const data = await emailService.getEmailTemplateById(id);
                    setName(data.name || '');
                    setSlug(data.slug || '');
                    setSubject(data.subject || '');
                    setBodyHtml(data.body_html || '');
                    setStatus(data.status || 'DRAFT');
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to fetch email template:", err);
                setError("Erro ao carregar dados do template. Por favor, tente novamente.");
                setIsLoading(false);
            }
        };

        fetchTemplateData();
    }, [id]);

    // Validar formulário
    const validateForm = () => {
        const errors = {
            name: '',
            slug: '',
            subject: '',
            bodyHtml: ''
        };

        let isValid = true;

        if (!name.trim()) {
            errors.name = 'Nome é obrigatório';
            isValid = false;
        }

        if (!slug.trim()) {
            errors.slug = 'Slug é obrigatório';
            isValid = false;
        } else if (!/^[a-z0-9-]+$/.test(slug)) {
            errors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens';
            isValid = false;
        }

        if (!subject.trim()) {
            errors.subject = 'Assunto é obrigatório';
            isValid = false;
        }

        const currentHtml = editor ? editor.getHTML() : bodyHtml;
        if (!currentHtml || !currentHtml.trim() || currentHtml === '<p></p>') {
            errors.bodyHtml = 'Conteúdo HTML é obrigatório';
            isValid = false;
        }

        setValidation(errors);
        return isValid;
    };

    // Salvar o template
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Obter o HTML atual do editor
            const currentHtml = editor ? editor.getHTML() : bodyHtml;

            const templateData = {
                name,
                slug,
                subject,
                body_html: currentHtml,
                status
            };

            let response;
            if (id && id !== 'new') {
                console.log(`Atualizando template existente com ID ${id}`);
                response = await emailService.updateEmailTemplate(id, templateData);
            } else {
                console.log('Criando novo template');
                response = await emailService.createEmailTemplate(templateData);
            }

            setSuccessMessage('Template salvo com sucesso!');

            // Aguardar um pouco para exibir a mensagem antes de redirecionar
            setTimeout(() => {
                navigate('/settings/email/list');
            }, 1500);
        } catch (err) {
            console.error("Failed to save email template:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Erro ao salvar o template. Por favor, tente novamente.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Função para voltar para a listagem
    const handleGoBack = () => {
        navigate('/settings/email/list');
    };

    // Função para gerar slug a partir do nome
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remover caracteres especiais
            .replace(/\s+/g, '-')     // Substituir espaços por hífens
            .replace(/-+/g, '-');     // Remover hífens duplicados
    };

    // Handler para quando o nome muda
    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);

        // Se o slug ainda não foi editado manualmente, atualize-o automaticamente
        if (!slug || slug === generateSlug(name)) {
            setSlug(generateSlug(newName));
        }
    };

    // Renderização condicional baseada no estado de carregamento
    if (isLoading) {
        return (
            <MainCard title="Editar Template de Email">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error && !name && !subject && !bodyHtml) {
        return (
            <MainCard title="Editar Template de Email">
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                >
                    Voltar para a Listagem
                </Button>
            </MainCard>
        );
    }

    return (
        <MainCard title={id === 'new' ? "Novo Template de Email" : "Editar Template de Email"}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMessage(null)}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}

            <Card
                elevation={2}
                sx={{
                    overflow: 'visible',
                    borderRadius: 2,
                    mb: 3
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nome do Template"
                                value={name}
                                onChange={handleNameChange}
                                error={!!validation.name}
                                helperText={validation.name}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                error={!!validation.slug}
                                helperText={validation.slug || "Identificador único para o template. Use apenas letras minúsculas, números e hífens."}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Assunto do Email"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                error={!!validation.subject}
                                helperText={validation.subject}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="DRAFT">Rascunho</MenuItem>
                                    <MenuItem value="PUBLISHED">Publicado</MenuItem>
                                </Select>
                                <FormHelperText>Apenas templates publicados podem ser usados pelo sistema</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Conteúdo HTML do Email:
                            </Typography>

                            {validation.bodyHtml && (
                                <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
                                    {validation.bodyHtml}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    minHeight: '300px',
                                    mb: 2,
                                    '& .ProseMirror': {
                                        padding: '16px',
                                        minHeight: '300px',
                                        '&:focus': {
                                            outline: 'none',
                                        },
                                        '& p.is-editor-empty:first-child::before': {
                                            content: 'attr(data-placeholder)',
                                            float: 'left',
                                            color: theme.palette.text.disabled,
                                            pointerEvents: 'none',
                                            height: 0
                                        }
                                    }
                                }}
                            >
                                <EditorMenuBar editor={editor} />
                                <EditorContent editor={editor} />
                            </Box>

                            <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                                Você pode usar variáveis no formato {'{{variableName}}'} que serão substituídas pelo sistema ao enviar o email.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                    disabled={isSaving}
                >
                    Voltar para a Listagem
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Salvando...' : 'Salvar Template'}
                </Button>
            </Box>
        </MainCard>
    );
};

export default EmailEditPage;