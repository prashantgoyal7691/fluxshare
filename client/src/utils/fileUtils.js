export const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }

    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

export const formatTotalFileSize = (files) => {
    const bytes = files.reduce(
        (total, file) => total + file.size,
        0,
    );

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }

    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};