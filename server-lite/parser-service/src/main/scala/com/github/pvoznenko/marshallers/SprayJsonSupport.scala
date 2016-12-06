package com.github.pvoznenko.marshallers

import akka.http.scaladsl.marshalling._
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.{HttpCharsets, MediaTypes}
import akka.http.scaladsl.unmarshalling.{FromEntityUnmarshaller, Unmarshaller}
import akka.stream.Materializer
import spray.json._

import scala.language.implicitConversions

/**
  * This file is modified from current development branch of akka-http.
  * TODO - replace this with akka-http internal unmarshaller when
  * A trait providing automatic to and from JSON marshalling/unmarshalling using an in-scope *spray-json* protocol.
  */
trait SprayJsonSupport {
  implicit def sprayJsonUnmarshallerConverter[T](reader: RootJsonReader[T])(implicit materializer: Materializer): FromEntityUnmarshaller[T] =
    sprayJsonUnmarshaller(reader, materializer)

  implicit def sprayJsonUnmarshaller[T](implicit reader: RootJsonReader[T], materializer: Materializer): FromEntityUnmarshaller[T] =
    sprayJsValueUnmarshaller.map(jsonReader[T].read)

  implicit def sprayJsValueUnmarshaller(implicit materializer: Materializer): FromEntityUnmarshaller[JsValue] =
    Unmarshaller.byteStringUnmarshaller.forContentTypes(`application/json`).mapWithCharset { (data, charset) ⇒
      val input =
        if (charset == HttpCharsets.`UTF-8`) ParserInput(data.toArray)
        else ParserInput(data.decodeString(charset.nioCharset))
      JsonParser(input)
    }

  //#sprayJsonMarshallerConverter
  implicit def sprayJsonMarshallerConverter[T](writer: RootJsonWriter[T])(implicit printer: JsonPrinter = CompactPrinter): ToEntityMarshaller[T] =
  sprayJsonMarshaller[T](writer, printer)

  //#sprayJsonMarshallerConverter
  implicit def sprayJsonMarshaller[T](implicit writer: RootJsonWriter[T], printer: JsonPrinter = CompactPrinter): ToEntityMarshaller[T] =
  sprayJsValueMarshaller compose writer.write

  implicit def sprayJsValueMarshaller(implicit printer: JsonPrinter = CompactPrinter): ToEntityMarshaller[JsValue] =
    Marshaller.StringMarshaller.wrap(MediaTypes.`application/json`)(printer)
}

object SprayJsonSupport extends SprayJsonSupport