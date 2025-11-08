import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap';

const BASE_URL = 'https://swapi.dev/api/people/';

const sanitizeUrl = (url) => (url ? url.replace('http://', 'https://') : null);

const parseNumericValue = (value) => {
  if (!value) {
    return undefined;
  }

  const numeric = Number(String(value).replace(/,/g, ''));
  return Number.isNaN(numeric) ? undefined : numeric;
};

const valueMatchesRange = (value, min, max) => {
  if (!min && !max) {
    return true;
  }

  const numeric = parseNumericValue(value);
  if (numeric === undefined) {
    return false;
  }

  if (min && numeric < Number(min)) {
    return false;
  }

  if (max && numeric > Number(max)) {
    return false;
  }

  return true;
};

const fetchAllPages = async (initialUrl) => {
  let url = initialUrl;
  const collected = [];

  while (url) {
    const { data } = await axios.get(url);
    collected.push(...data.results);
    url = sanitizeUrl(data.next);
  }

  return collected;
};

const CharacterLoader = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [minMass, setMinMass] = useState('');
  const [maxMass, setMaxMass] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  const handleError = useCallback((message) => {
    setError(message);
    setLoading(false);
  }, []);

  const handleFetch = useCallback(async (urlBuilder, searchLabel) => {
    setLoading(true);
    setError('');

    try {
      const people = await fetchAllPages(urlBuilder());
      setCharacters(people);
      setLastQuery(searchLabel);
      setLoading(false);
    } catch (err) {
      if (axios.isCancel(err)) {
        return;
      }

      handleError('No se pudieron cargar los personajes. Intenta nuevamente.');
      console.error(err);
    }
  }, [handleError]);

  const loadAllCharacters = useCallback(() => {
    handleFetch(() => BASE_URL, 'Todos');
  }, [handleFetch]);

  useEffect(() => {
    if (!query.trim()) {
      setCharacters([]);
      setLastQuery('');
      return;
    }

    let isSubscribed = true;
    const debounce = setTimeout(() => {
      if (!isSubscribed) {
        return;
      }

      handleFetch(
        () => `${BASE_URL}?search=${encodeURIComponent(query.trim())}`,
        `Búsqueda: "${query.trim()}"`
      );
    }, 400);

    return () => {
      isSubscribed = false;
      clearTimeout(debounce);
    };
  }, [query, handleFetch]);

  const filteredCharacters = useMemo(() => {
    const sorted = [...characters].sort((a, b) =>
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    return sorted.filter((character) => {
      const matchesGender =
        !genderFilter ||
        character.gender.toLowerCase() === genderFilter.toLowerCase();

      const matchesMass = valueMatchesRange(character.mass, minMass, maxMass);
      const matchesHeight = valueMatchesRange(
        character.height,
        minHeight,
        maxHeight
      );

      return matchesGender && matchesMass && matchesHeight;
    });
  }, [characters, genderFilter, minMass, maxMass, minHeight, maxHeight]);

  return (
    <Container className="py-5">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
            <div>
              <Card.Title as="h1" className="mb-2 text-center text-md-start">
                Personajes de Star Wars
              </Card.Title>
              <Card.Subtitle className="text-muted">
                Busca y filtra personajes de forma instantánea utilizando la API pública de Star Wars.
              </Card.Subtitle>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="text-uppercase fw-semibold"
              onClick={loadAllCharacters}
              disabled={loading}
            >
              {loading && !query ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Cargando...
                </>
              ) : (
                'Cargar todos'
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Form>
            <Row className="gy-3">
              <Col xs={12} lg={4}>
                <Form.Label className="text-uppercase fw-semibold text-muted small">
                  Nombre
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text id="search-icon" className="bg-white">
                    🔍
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Escribe para buscar personajes..."
                    aria-label="Buscar personajes"
                    aria-describedby="search-icon"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Las búsquedas se realizan automáticamente mientras escribes.
                </Form.Text>
              </Col>

              <Col xs={12} sm={6} lg={2}>
                <Form.Label className="text-uppercase fw-semibold text-muted small">
                  Género
                </Form.Label>
                <Form.Select
                  value={genderFilter}
                  onChange={(event) => setGenderFilter(event.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                  <option value="hermaphrodite">Hermafrodita</option>
                  <option value="n/a">Sin género</option>
                  <option value="unknown">Desconocido</option>
                </Form.Select>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Form.Label className="text-uppercase fw-semibold text-muted small">
                  Peso (kg)
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Mín."
                    value={minMass}
                    onChange={(event) => setMinMass(event.target.value)}
                  />
                  <InputGroup.Text>—</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Máx."
                    value={maxMass}
                    onChange={(event) => setMaxMass(event.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={12} lg={3}>
                <Form.Label className="text-uppercase fw-semibold text-muted small">
                  Estatura (cm)
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Mín."
                    value={minHeight}
                    onChange={(event) => setMinHeight(event.target.value)}
                  />
                  <InputGroup.Text>—</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Máx."
                    value={maxHeight}
                    onChange={(event) => setMaxHeight(event.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="shadow-sm">
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">
          {lastQuery ? (
            <>
              Resultado de <strong>{lastQuery}</strong>
            </>
          ) : (
            'Escribe un nombre o utiliza “Cargar todos” para comenzar.'
          )}
        </span>
        <Badge bg="secondary" pill>
          {filteredCharacters.length} resultados
        </Badge>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="grow" role="status" />
          <p className="mt-3 text-muted">Consultando la API de Star Wars...</p>
        </div>
      )}

      {!loading && lastQuery && filteredCharacters.length === 0 && (
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center text-muted py-5">
            <p className="fs-5 mb-2">No hay personajes que coincidan con los filtros.</p>
            <p className="mb-0">Prueba ajustando los valores de búsqueda o amplia los rangos.</p>
          </Card.Body>
        </Card>
      )}

      <Row className="gy-4">
        {filteredCharacters.map((character) => (
          <Col key={character.url} xs={12} sm={6} lg={4} xl={3}>
            <Card className="character-card shadow-sm h-100">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <span>{character.name}</span>
                  <Badge bg="info" text="dark">
                    {character.birth_year}
                  </Badge>
                </Card.Title>
                <Card.Text className="text-muted small">
                  <span className="d-block mb-1">
                    <strong>Género:</strong> {character.gender}
                  </span>
                  <span className="d-block mb-1">
                    <strong>Peso:</strong> {character.mass} kg
                  </span>
                  <span className="d-block mb-1">
                    <strong>Estatura:</strong> {character.height} cm
                  </span>
                  <span className="d-block">
                    <strong>Color de ojos:</strong> {character.eye_color}
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CharacterLoader;


