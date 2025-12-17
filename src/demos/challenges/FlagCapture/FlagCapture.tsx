import { useEffect, useRef, useState } from "react";

const CHALLENGE_URL =
  "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge";
const CHARACTER_REVEAL_DELAY_MS = 500;

// Selectors for parsing the challenge page
const CLASS_FILTER = "45";
const ELEMENT_SELECTOR = "B.ref";
const ID_FILTER = "92";
const PARSER_ERROR_TAG = "parsererror";
const TAG_FILTER = "78";
const VALUE_ATTRIBUTE = "value";

/**
 * Parses HTML text to extract a hidden URL from specially marked elements.
 *
 * Expected DOM structure:
 * <section data-id="92...">
 *   <article data-class="...45">
 *     <div data-tag="...78...">
 *       <B class="ref" value="url-part">
 *     </div>
 *   </article>
 * </section>
 *
 * Filters elements by:
 * - Parent div with data-tag containing "78"
 * - Grandparent article with data-class ending with "45"
 * - Great-grandparent section with data-id starting with "92"
 *
 * @param text - HTML text to parse
 * @returns The hidden URL constructed from matching element values, or empty string if none found
 * @throws Error if HTML parsing fails
 */
const getHiddenUrl = (text: string): string => {
  const domParser = new DOMParser();
  const parsedDocument: Document = domParser.parseFromString(text, "text/html");

  // Check for parser errors
  const parserError = parsedDocument.querySelector(PARSER_ERROR_TAG);
  if (parserError) {
    throw new Error(
      `Failed to parse HTML: ${parserError.textContent ?? "Unknown error"}`,
    );
  }

  const elements: NodeListOf<HTMLElement> =
    parsedDocument.querySelectorAll(ELEMENT_SELECTOR);

  // Use reduce for efficient single-pass filtering and extraction
  const urlParts = Array.from(elements).reduce<string[]>(
    (acc: string[], element: HTMLElement) => {
      const value = element.getAttribute(VALUE_ATTRIBUTE);

      // Skip elements without a value attribute or with empty values
      if (!value) {
        return acc;
      }

      // Validate parent chain exists and matches expected structure
      const parent = element.parentElement;
      if (!parent || !parent.dataset.tag?.includes(TAG_FILTER)) {
        return acc;
      }

      const grandparent = parent.parentElement;
      if (!grandparent || !grandparent.dataset.class?.endsWith(CLASS_FILTER)) {
        return acc;
      }

      const greatGrandparent = grandparent.parentElement;
      if (
        !greatGrandparent ||
        !greatGrandparent.dataset.id?.startsWith(ID_FILTER)
      ) {
        return acc;
      }

      // Add valid value to accumulator
      acc.push(value);
      return acc;
    },
    [],
  );

  return urlParts.join("");
};

/**
 * Fetches text content from a URL with abort signal support.
 * @param url - The URL to fetch from
 * @param signal - AbortSignal to cancel the request
 * @returns The response text
 * @throws Error if response status is not ok
 */
const getTextResponse = async (
  url: string,
  signal: AbortSignal,
): Promise<string> => {
  const response: Response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} - Failed to fetch: ${url}`,
    );
  }
  return response.text();
};

/**
 * Component that fetches and displays a hidden flag character by character.
 *
 * Workflow:
 * 1. Fetches the challenge page from the configured URL
 * 2. Parses the HTML to extract a hidden URL using specific DOM filters
 * 3. Fetches the flag text from the hidden URL
 * 4. Displays the flag one character at a time with animated reveal
 *
 * @returns A React component that shows loading, error, or animated flag display
 */
const FlagCapture = () => {
  const [error, setError] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fullFlagRef = useRef<string>("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const renderFlag = async () => {
      try {
        setIsLoading(true);
        setError("");
        setFlag("");

        const pageText: string = await getTextResponse(
          CHALLENGE_URL,
          abortController.signal,
        );

        if (!pageText || pageText.length === 0) {
          throw new Error("Failed to fetch challenge page");
        }

        const hiddenUrl: string = getHiddenUrl(pageText);

        if (!hiddenUrl) {
          throw new Error("Failed to extract hidden URL from page");
        }

        const flagText: string = await getTextResponse(
          hiddenUrl,
          abortController.signal,
        );

        if (!flagText || flagText.length === 0) {
          throw new Error("No flag data received");
        }

        const firstCharacter = flagText[0];
        if (firstCharacter === undefined) {
          throw new Error("Flag text is empty");
        }

        fullFlagRef.current = flagText;
        setFlag(firstCharacter); // Show first character immediately
        setIsLoading(false);

        // Start interval to reveal remaining characters
        // If flagText has only 1 character, interval will clear itself on first tick
        let currentIndex = 1;
        intervalRef.current = setInterval(() => {
          if (currentIndex < fullFlagRef.current.length) {
            currentIndex++;
            setFlag(fullFlagRef.current.slice(0, currentIndex));
          } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }, CHARACTER_REVEAL_DELAY_MS);
      } catch (e: unknown) {
        // Ignore abort errors - don't update state when aborted
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }
        console.error(`Failed to render flag: ${e}`);
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load flag. Please try again.",
        );
        setIsLoading(false);
      }
    };

    renderFlag();

    return () => {
      abortController.abort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div aria-live="polite" className="mx-auto max-w-4xl" role="status">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="text-red-600" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (flag.length === 0) {
    return null;
  }

  return (
    <section aria-label="Flag characters" className="mx-auto max-w-4xl">
      <ul>
        {Array.from({ length: flag.length }, (_, index) => (
          <li key={index}>{flag[index]}</li>
        ))}
      </ul>
    </section>
  );
};

export default FlagCapture;
